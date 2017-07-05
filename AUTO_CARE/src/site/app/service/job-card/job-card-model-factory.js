(function () {
    var factory = function () {
        function JobCard() {

        }

        JobCard.prototype = {
            "jobNo": null,
            "jobDate": null,
            "vehicleNo": null,
            "type": null,
            "make": null,
            "inMillage": null,
            "nsm":null,
            "jobC":null,
            "customer": {
                "customerNo": null,
                "name": null,
                "nic": null,
                "mobileNo": null,
                "birthDate":null
            }
        };
        return JobCard;
    };
    angular.module("AppModule")
            .factory("JobCardModelFactory", factory);
    
    var factory1 = function () {
        function CategoryDetail() {

        }
        CategoryDetail.prototype = {
            "indexNo": null,
            "jobNo": null,
            "category": null,
            "itemDescription": null
        };
        return CategoryDetail;
    };
    angular.module("AppModule")
            .factory("CategoryModelFactory", factory1);

}());