const catalog = require('./catalog');

const catalogService = {
    CatalogService: {
        CatalogPort: {

            GetManufacturers: function(args, callback) {
                catalog.getManufacturers(manufacturers => callback({
                    manufacturers: {
                        manufacturer: manufacturers
                    }
                }));
            },
            
            GetCountByManufacturer: function(args, callback) {
                catalog.getCountByManufacturer(args.manufacturer, count => callback({
                    itemCount: count
                }));
            },

            GetByScreenType: function(args, callback) {
                catalog.getByScreenType(args.screenType, laptops => callback({
                    laptops: {
                        laptop: laptops
                    }
                }));
            },
            
            GetCountByAspectRatio: function(args, callback) {
                let resolutions;
                if(args.aspectRatio === '16:9') {
                    resolutions = "'3840x2160', '2560x1440', '1920x1080', '1600x900', '1366x768', '1280x720', '1024x576'";
                }
                else if(args.aspectRatio === '16:10') {
                    resolutions = "'1280x800', '1440x900', '1680x1050', '1920x1200', '2560x1600'";
                }
                catalog.getCountByScreenResolution(resolutions, count => callback({
                    itemCount: count
                }));
            }

        }
    }
};

module.exports = {
    catalogService
};


