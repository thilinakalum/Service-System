(function () {
    var factory = function ($q, JobCardService, JobCardModelFactory, CategoryModelFactory) {
        function JobCardModel() {
            this.constructor();
        }

        JobCardModel.prototype = {
            jobCard: null,
            categoryDetail: {},
            user:{},
            searchKeyword: null,
            showSuggestions: false,
            searchSuggestions: [],
            imagemodel: [],
            //uib-typeahead
            vTypeList: [],
            vMakeList: [],
            clientList: [],
            //CATEGORY
            categoryList: [],
            descriptionList: [],
            discriptionSelectedList: [],
            categoryDetailList: [],

            //constuctor
            constructor: function () {
                var that = this;
                this.categoryDetail = CategoryModelFactory();
//                console.log("constructed model");

                JobCardService.getVehicleType()
                        .success(function (data) {
                            that.vTypeList = data;
                        });
                JobCardService.getVehicleMake()
                        .success(function (data) {
                            that.vMakeList = data;
                        });
//                JobCardService.findByVehicleNumber()
//                        .success(function (data) {
//                            that.clientList = data;
//                        });
                JobCardService.findAllCustomer()
                        .success(function (data) {
                            that.clientList = data;
                        });
                JobCardService.findAllCategory()
                        .success(function (data) {
                            that.categoryList = data;
                        });
                JobCardService.findAllDescription()
                        .success(function (data) {
                            that.descriptionList = data;
                        });
            },
            loadAllCategoryDetails: function (jobNo) {
                var that = this;
                JobCardService.findAllCategoryDetail(jobNo)
                        .success(function (data) {
                            that.categoryDetailList = data;
                        });
            },
            clear: function () {
                this.jobCard = {};
                this.searchKeyword = null;

            },
            newJobCard: function () {
                this.jobCard = new JobCardModelFactory();

                this.searchKeyword = this.jobCard.vehicleNo;
            },
            setJobCard: function (jobCard) {
                this.jobCard = jobCard;
                this.loadAllCategoryDetails(jobCard.jobNo);
                this.searchKeyword = this.jobCard.vehicleNo;
//                this.jobCard.jobNo = null;
            },
            saveJobCard: function () {
                var that = this;
                var customer = this.jobCard.customer;
                this.jobCard.customer = customer;
                var defer = $q.defer();
                JobCardService.saveJobCard(JSON.stringify(that.jobCard))
                        .success(function (data) {
                            that.jobCard = data;
                            defer.resolve(data);
                        })
                        .error(function (data) {
                            console.log("ERROR:" + data);
                            defer.reject();
                        });
                return defer.promise;
            },
            getCustomerByNic: function (indexNo) {
                var that = this;
                angular.forEach(this.clientList, function (values) {
                    if (values.customerNo === indexNo) {
                        that.jobCard.customer = values;
                        return;
                    }
                });
            },
            getCustomerByMobileNo: function (indexNo) {
                var that = this;
                angular.forEach(this.clientList, function (values) {
                    if (values.customerNo === indexNo) {
                        that.jobCard.customer = values;
                        return;
                    }
                });
            },
            //load vehicles
            findByVehicleNumber: function () {
                var that = this;
                JobCardService.findByVehicleNumber(this.searchKeyword)
                        .success(function (data) {
                            that.searchSuggestions = data;
                        })
                        .error(function (e) {
                            that.searchSuggestions = [];
                        });
            },
            //load vehicle type
            vTypeLabel: function (indexNo) {
                var vmake = "";
                angular.forEach(this.vTypeList, function (value) {
                    if (value.vmake === parseInt(indexNo)) {
                        vmake = value.vmake;
                        return;
                    }
                });
                return vmake;
            },
            //saveImage
            uploadForm: function () {

            },

//saveCategoryList
            saveCategoryDatail: function () {
                var that = this;
                var defer = $q.defer();
                this.saveDescription(this.categoryDetail.itemDescription);
                console.log(that.jobCard);
                console.log(that.jobCard);
                JobCardService.saveCategoryDetail(JSON.stringify(this.categoryDetail), that.jobCard.jobNo)
                        .success(function (data) {
                            that.categoryDetailList.push(data);
                            that.categoryDetail = {};
                            defer.resolve(data);
                        })
                        .error(function (data) {
                            defer.reject(data);
                        });
                return defer.promise;
            },
            saveDescription: function (description) {
                var data = this.checkCategoryDescriptionAvalability(description);
                if (data) {
                    console.log("this item already exists !!!");
                } else {
                    var objects = {
                        "description": data
                    };
                    var that = this;
                    JobCardService.saveDescription(JSON.stringify(objects))
                            .success(function (data) {
                                console.log(data);
                                that.descriptionList.push(data);
                            })
                            .error(function () {
                                console.log("saveDiscription fail !!!");
                            });
                }
            },
            checkCategoryDescriptionAvalability: function (discription) {
                var data = "";
                angular.forEach(this.descriptionList, function (values) {
                    if (values.itemDes === discription) {
                        data = values;
                        return;
                    }
                });
                return data;
            },
            deleteCategoryDetail: function (indexNo, index) {
                var that = this;
                var defer = $q.defer();
                JobCardService.deleteCategoryDetail(indexNo)
                        .success(function (data) {
                            that.categoryDetailList.splice(index, 1);
                            defer.resolve(data);
                        })
                        .error(function (data) {
                            console.log("Category Detail delete Error !!!");
                            defer.reject(data);
                        });
                return defer.promise;
            },
            searchCategoryWiseDescription: function (category) {
                var that = this;
                that.discriptionSelectedList = [];
                //empty table data list
                if (that.categoryDetailList.length === 0) {
                    that.discriptionSelectedList = [];
                    that.discriptionSelectedList = that.descriptionList;
                } else {
                    angular.forEach(that.categoryDetailList, function (categoryValues) {
                        // table get 
                        if (categoryValues.category === category) {
                            that.discriptionSelectedList = [];
                            angular.forEach(that.descriptionList, function (itemDescriptionValues) {
                                if (categoryValues.itemDescription !== itemDescriptionValues.itemDes) {
                                    that.discriptionSelectedList.push(itemDescriptionValues);
                                    console.log(that.discriptionSelectedList.length);
                                }
                            });
                        } else {
                            that.discriptionSelectedList = [];
                            that.discriptionSelectedList = that.descriptionList;
                        }
                    });
                }
            },
            downloardImage: function (jobNo) {
                var that = this;
                var defer = $q.defer();
                JobCardService.imageDownloard(jobNo)
                        .success(function (data) {
                            that.imagemodel = data;
                            defer.resolve(data);
                        })
                        .error(function (data) {
                            defer.reject(data);
                        });
                return defer.promise;
            }
        };
        return JobCardModel;
    };

    angular.module("AppModule")
            .factory("JobCardModel", factory);
}());