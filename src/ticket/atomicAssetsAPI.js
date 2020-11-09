const { RESTDataSource } = require("apollo-datasource-rest");

const DEFAULT_MARKETPLACE = "testmarket11";

class AtomicAssetsAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL =
            process.env.NODE_ENV === "production"
                ? "https://wax.api.atomicassets.io/"
                : "https://test.wax.api.atomicassets.io/";
    }

    async getAtomicAssets(path, params, init) {
        return this.get(`atomicassets/v1/${path}`, params, init);
    }

    async getAtomicMarket(path, params, init) {
        return this.get(`atomicmarket/v1/${path}`, params, init);
    }

    async getEventTicketSalesByTemplateIds(templateIds) {
        if (!templateIds || templateIds.length === 0) {
            return {
                original: [],
                resale: [],
            };
        }

        const templateResponse = await this.getAtomicAssets("templates", {
            ids: templateIds.join(","),
        });

        if (!templateResponse.success || !templateResponse.data || !Array.isArray(templateResponse.data)) {
            console.log("ERROR: Unable get templates from AtomicAssets API.");
            return;
        }

        const templates = templateResponse.data.map((template) => this.ticketTemplateReducer(template));

        let ticketSalesData = [];

        await Promise.all(
            templates.map(async (template) => {
                const salesResponse = await this.getAtomicMarket("sales", {
                    state: 1, // 1: LISTED SALE
                    marketplace: DEFAULT_MARKETPLACE,
                    template_id: template.templateId,
                    order: "asc",
                    sort: "price",
                });

                if (!salesResponse.success || !salesResponse.data || !Array.isArray(salesResponse.data)) {
                    console.log("ERROR: Unable get sales from AtomicMarket API.");
                    return;
                }

                ticketSalesData = [...ticketSalesData, ...salesResponse.data];
            }),
        );

        return this.eventTicketSalesReducer(ticketSalesData, templates);
    }

    async getEventTicketsByAccountName(accountName) {
        const assetsResponse = await this.getAtomicAssets("assets", {
            owner: accountName,
            schema_name: "ticket", // TODO: Change depending on constant schema used in frontend
            order: "desc",
            sort: "updated",
        });

        if (!assetsResponse.success || !assetsResponse.data || !Array.isArray(assetsResponse.data)) {
            console.log("ERROR: Unable get assets from AtomicMarket API.");
            return;
        }

        return this.ticketsByEventReducer(assetsResponse.data);
    }

    async getTicketByAssetId(assetId) {
        const assetResponse = await this.getAtomicAssets(`assets/${assetId}`);

        if (!assetResponse.success || !assetResponse.data) {
            console.log("ERROR: Unable get assets from AtomicMarket API.");
            return;
        }

        if (!this.isValidTicketAsset(assetResponse.data)) {
            console.log("ERROR: Invalid asset type. (Not a EOS Event ticket asset)");
            return;
        }

        return this.ticketReducer(assetResponse.data);
    }

    async getCollectionsByAccountName(accountName) {
        const response = await this.getAtomicAssets("collections", {
            author: accountName,
            match: accountName,
        });

        if (!response.success || !response.data || !Array.isArray(response.data)) {
            console.log("ERROR: Unable get collections from AtomicMarket API.");
            return;
        }

        return response.data.map((collection) => this.collectionReducer(collection));
    }

    eventTicketSalesReducer(ticketSalesData, templates) {
        const originalTicketSalesTemplateMap = {};
        const resaleticketSalesTemplateMap = {};

        templates.forEach((template) => {
            originalTicketSalesTemplateMap[template.templateId] = {
                template,
                sales: [],
            };
            resaleticketSalesTemplateMap[template.templateId] = {
                template,
                sales: [],
            };
        });

        ticketSalesData.forEach((ticketSaleData) => {
            const ticketSale = this.ticketSaleReducer(ticketSaleData);
            if (ticketSale.seller === ticketSaleData.collection.author) {
                originalTicketSalesTemplateMap[ticketSale.ticket.templateId].sales.push(ticketSale);
            } else {
                resaleticketSalesTemplateMap[ticketSale.ticket.templateId].sales.push(ticketSale);
            }
        });

        return {
            original: Object.values(originalTicketSalesTemplateMap),
            resale: Object.values(resaleticketSalesTemplateMap),
        };
    }

    ticketSaleReducer(ticketSaleData) {
        return {
            saleId: ticketSaleData.sale_id,
            offerId: ticketSaleData.offer_id,
            seller: ticketSaleData.seller,
            price: this.ticketPriceReducer(ticketSaleData.price),
            ticket: this.ticketReducer(ticketSaleData.assets[0]),
        };
    }

    ticketPriceReducer(ticketPriceData) {
        return {
            amount: ticketPriceData.amount / Math.pow(10, ticketPriceData.token_precision),
            currency: ticketPriceData.token_symbol,
        };
    }

    ticketReducer(ticketData) {
        return {
            templateId: ticketData.template.template_id,
            templateMint: ticketData.template_mint,
            assetId: ticketData.asset_id,
            owner: ticketData.owner,
            eventId: ticketData.data.eventId,
            name: ticketData.data.name,
            description: ticketData.data.description,
            image: ticketData.data.img,
        };
    }

    ticketTemplateReducer(ticketTemplateData) {
        return {
            templateId: ticketTemplateData.template_id,
            maxSupply: ticketTemplateData.max_supply,
            eventId: ticketTemplateData.immutable_data.eventId,
            name: ticketTemplateData.immutable_data.name,
            description: ticketTemplateData.immutable_data.description,
            image: ticketTemplateData.immutable_data.img,
        };
    }

    ticketsByEventReducer(ticketsData) {
        const eventTicketsMap = {};
        ticketsData.forEach((ticketData) => {
            if (this.isValidTicketAsset(ticketData)) {
                const eventId = ticketData.data.eventId;

                if (!eventTicketsMap[eventId]) {
                    eventTicketsMap[eventId] = {};
                }

                const templateId = ticketData.template.template_id;

                if (!eventTicketsMap[eventId][templateId]) {
                    eventTicketsMap[eventId][templateId] = {
                        template: this.ticketTemplateReducer(ticketData.template),
                        tickets: [],
                    };
                }

                eventTicketsMap[eventId][templateId].tickets.push(this.ticketReducer(ticketData));
            }
        });

        return Object.keys(eventTicketsMap).map((eventId) => ({
            eventId,
            tickets: Object.values(eventTicketsMap[eventId]),
        }));
    }

    collectionReducer(collectionData) {
        return {
            collectionName: collectionData.collection_name,
            author: collectionData.author,
        };
    }

    isValidTicketAsset(assetData) {
        return this.isValidAssetSchema(assetData.schema) && this.isValidAssetTemplate(assetData.template);
    }

    isValidAssetSchema(schemaData) {
        return schemaData.schema_name === "ticket";
    }

    isValidAssetTemplate(templateData) {
        return (
            templateData.immutable_data.name &&
            templateData.immutable_data.description &&
            templateData.immutable_data.eventId &&
            templateData.immutable_data.img
        );
    }
}

module.exports = { AtomicAssetsAPI };