angular.module("ContactModule", []).controller('contactController', function($scope, $location, $anchorScroll){
    var id = 6, editIndex, alerttimer;

    $scope.dynamicFieldControls = {
        SectionTitle: "Contact List",
        ControlDetails: [
            {
                "DisplayName": "Họ",
                "FieldName": "FirstName",
                "NGModelName": "firstName",
                "ControlType": "text",
                "MaxLength": "",
                "IsReadOnly" : false,
                "Pattern": "[a-zA-Z]*",
                "Mandatory": true,
                "PlaceHolderText": "Enter First Name",
                "SearchPlaceholder": "Search First Name",
                "ErrorMessage": "First Name is required."
            },
            {
                "DisplayName": "Tên đệm",
                "FieldName": "MiddleName",
                "NGModelName": "middleName",
                "ControlType": "text",
                "MaxLength": "",
                "IsReadOnly" : false,
                "Pattern": "[a-zA-Z]*",
                "Mandatory": false,
                "PlaceHolderText": "Enter Middle Name",
                "SearchPlaceholder": "Search Middle Name",
                "ErrorMessage": ""
            },
            {
                "DisplayName": "Tên",
                "FieldName": "LastName",
                "NGModelName": "lastName",
                "ControlType": "text",
                "MaxLength": "",
                "IsReadOnly" : false,
                "Pattern": "[a-zA-Z]*",
                "Mandatory": false,
                "PlaceHolderText": "Enter Last Name",
                "SearchPlaceholder": "Search Last Name",
                "ErrorMessage": ""
            },
            {
                "DisplayName": "Số điện thoại",
                "FieldName": "ContactNumber",
                "NGModelName": "contactNumber",
                "ControlType": "number",
                "MaxLength": "",
                "IsReadOnly" : false,
                "Pattern": "[0-9]{10}",
                "Mandatory": true,
                "PlaceHolderText": "Enter Contact Number",
                "SearchPlaceholder": "Search Contact Number",
                "ErrorMessage": "Please enter a 10 digit contact number."
            },
            {
                "DisplayName": "Email",
                "FieldName": "ContactEmailId",
                "NGModelName": "contactEmail",
                "ControlType": "email",
                "MaxLength": "",
                "IsReadOnly" : false,
                "Pattern": "/^[_A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,4})$/",
                "Mandatory": true,
                "PlaceHolderText": "Enter Contact Email Id",
                "SearchPlaceholder": "Search Contact Email Id",
                "ErrorMessage":  "Email Id must be in correct format."
            }
        ]
    };



    $scope.contactList =  [
        {
            "id": 1,
            "firstName": "Hoàng",
            "middleName": "Quốc",
            "lastName": "Duy",
            "contactNumber": 0904243175,
            "contactEmail": "hoangqucduy@gmail.com"
        },
        {
            "id": 2,
            "firstName": "Hoàng",
            "middleName": "Bá",
            "lastName": "Chức",
            "contactNumber": 0724973275,
            "contactEmail": "hoangchuc@gmail.com"
        },
        {
            "id": 3,
            "firstName": "Trần",
            "middleName": "Thị Xuân",
            "lastName": "Thủy",
            "contactNumber": 07023452643,
            "contactEmail": "xuanthuy@gmail.com"
        },
        {
            "id": 4,
            "firstName": "Nguyễn",
            "middleName": "Phương",
            "lastName": "Uyên",
            "contactNumber": 0434246923,
            "contactEmail": "uyen12323@gmail.com"
        },
        {
            "id": 5,
            "firstName": "Bùi",
            "middleName": "Văn",
            "lastName": "Đạt",
            "contactNumber": 0934754239,
            "contactEmail": "datbuivan@gmail.com"
        }
    ];


    function scrollToParticularId(id){
        $location.hash(id);
        $anchorScroll();
    }


    function showAlertMessage(type, message, duration){
        if(!duration){
            duration = 4000;
        }
        $scope.alerts = [];

        $scope.alerts.push({
            type: type,
            message: message,
        });

        if(alerttimer){clearTimeout(alerttimer);}
        scrollToParticularId("alertbox");
        alerttimer = setTimeout(function(){
            $scope.alerts = [];
            $scope.$apply();
        }, duration);
    }


    function duplicateValueInContactList(value, keyName){
        var hasDuplicate = 0;
        for(var i=0;i<$scope.contactList.length;i++){
            if(!hasDuplicate && $scope.contactList[i][keyName]===value && editIndex!==i){
                hasDuplicate = 1;
            }
        }
        return hasDuplicate;
    }

    $scope.buttonClicked = function(clickedfrom, contactInfo, index, length){
        switch(clickedfrom){
            case 5:
            case 1:
                $scope.contactInfo = {};
                if(clickedfrom===1){
                    $scope.showForm = true;
                    scrollToParticularId("contactForm");
                }else{
                    $scope.showForm = false;
                }
                editIndex = -1;
                break;
            case 2:
                editIndex = index;
                $scope.showForm = true;
                $scope.contactInfo = angular.copy(contactInfo);
                scrollToParticularId("contactForm");
                break;
            case 3:
                editIndex = -1;
                if(length){
                    $scope.contactList.splice(index, 1);
                    if(length===1){
                        $scope.buttonClicked(1);
                    }else{
                        $scope.buttonClicked(5);
                    }
                    showAlertMessage("success", 'Deleted.');
                }
                break;
            case 4:
                if(!duplicateValueInContactList(contactInfo['contactNumber'], 'contactNumber')){
                    if(!duplicateValueInContactList(contactInfo['contactEmail'], 'contactEmail')){
                        if(contactInfo.id){
                            if(editIndex>-1){
                                $scope.contactList.splice(editIndex, 1);
                                $scope.contactList.splice(editIndex, 0, contactInfo);
                                showAlertMessage("success", 'Saved.');
                            }
                        }else{
                            $scope.contactList.push(angular.extend(contactInfo,{id: ++id}));
                            showAlertMessage("success", 'Added Successfully.');
                        }
                        $scope.showForm = false;
                    }else{
                        showAlertMessage("danger", "Email Id already exists.");
                    }
                }else{
                    showAlertMessage("danger", "Contact Number already exists.");
                }
                break;
        }
    };
    $scope.searchPlaceholder = "Search Contact by Name, Contact Number or Email Id";


    $scope.addSearchFilter = function (item, add) {
        $scope.showToggle = false;
        if(add){
            $scope.searchPlaceholder = item.SearchPlaceholder;
            $scope.selectedItem = item;
        }else{
            $scope.searchPlaceholder = "Search Contact by Name, Contact Number or Email Id";
            $scope.selectedItem = undefined;
        }
    };

    $scope.removeAlert  = function(){
        $scope.alerts = [];
    };

});