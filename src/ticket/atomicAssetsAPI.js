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

    async getEventTicketSales(collectionName, schemaName) {
        const templateResponse = await this.getAtomicAssets("templates", {
            collection_name: collectionName,
            schema_name: schemaName,
        });

        if (!templateResponse.success || !templateResponse.data || !Array.isArray(templateResponse.data)) {
            console.log("ERROR: Unable get templates from AtomicAssets API.");
            return;
        }

        const templates = templateResponse.data.map((template) => this.ticketTemplateReducer(template));

        const salesResponse = await this.getAtomicMarket("sales", {
            state: 1, // 1: LISTED SALE
            marketplace: DEFAULT_MARKETPLACE,
            collection_name: collectionName,
            schema_name: schemaName,
            order: "asc",
            sort: "price",
        });

        if (!salesResponse.success || !salesResponse.data || !Array.isArray(salesResponse.data)) {
            console.log("ERROR: Unable get sales from AtomicMarket API.");
            return;
        }

        return this.eventTicketSalesReducer(salesResponse.data, templates);
    }

    async getTicketsByAccountName(accountName) {
        const assetsResponse = await this.getAtomicAssets("assets", {
            owner: accountName,
            order: "desc",
            sort: "updated",
        });

        if (!assetsResponse.success || !assetsResponse.data || !Array.isArray(assetsResponse.data)) {
            console.log("ERROR: Unable get assets from AtomicMarket API.");
            return;
        }

        return assetsResponse.data.map((ticketData) => this.ticketReducer(ticketData));
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
            console.log(ticketSale);
            if (ticketSale.seller === ticketSaleData.collection.author) {
                originalTicketSalesTemplateMap[ticketSale.ticket.templateId].sales.push(ticketSale);
            } else {
                resaleticketSalesTemplateMap[ticketSale.ticket.templateId].sales.push(ticketSale);
            }
        });

        const eventTicketSales = {
            original: [],
            resale: [],
        };

        Object.values(originalTicketSalesTemplateMap).forEach((ticketSalesBytemplate) => {
            eventTicketSales.original.push(ticketSalesBytemplate);
        });

        Object.values(resaleticketSalesTemplateMap).forEach((ticketSalesBytemplate) => {
            eventTicketSales.resale.push(ticketSalesBytemplate);
        });

        return eventTicketSales;
    }

    ticketSaleReducer(ticketSaleData) {
        return {
            saleId: ticketSaleData.sale_id,
            offerId: ticketSaleData.offer_id,
            seller: ticketSaleData.seller,
            price: this.ticketPriceReducer(ticketSaleData.price),
            ticket: this.ticketForSaleReducer(ticketSaleData.assets[0]),
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
}

module.exports = { AtomicAssetsAPI };
