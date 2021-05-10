class CatalogService {
    static serviceUrl = 'http://localhost:3000/catalog-service?';

    static GetManufacturers() {
        return {
            url: CatalogService.serviceUrl + 'GetManufacturers',
            method: 'GetManufacturersRequest',
            data: { }
        }
    };

    static GetCountByManufacturer(manufacturer) {
        return {
            url: CatalogService.serviceUrl + 'GetCountByManufacturer',
            method: 'GetCountByManufacturerRequest',
            data: { manufacturer: manufacturer }
        }
    };

    static GetByScreenType(screenType) {
        return {
            url: CatalogService.serviceUrl + 'GetByScreenType',
            method: 'GetByScreenTypeRequest',
            data: { screenType: screenType }
        }
    };

    static GetCountByAspectRatio(aspectRatio) {
        return {
            url: CatalogService.serviceUrl + 'GetCountByAspectRatio',
            method: 'GetCountByAspectRatioRequest',
            data: { aspectRatio: aspectRatio }
        }
    }

}