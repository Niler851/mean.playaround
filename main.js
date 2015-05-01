var app = angular.module("myApp", ['ngRoute']);

app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "templates/home.html",
        controller: 'HomeController'
    })
    .when('/settings',{
        templateUrl: 'templates/settings.html',
        controller: 'SettingsController'
    })
    .otherwise({redirectTo: '/'});
}]);

app.service('mailService', ['$http','$q', function($http, $q){
    var getMail = function() {
        return $http({
            method: 'GET',
            url: '/api/emails'
        });
    };

    var sendEmail = function(mail){
        var d = $q.defer();

        $http({
            method: 'POST',
            url: '/api/emails',
            data: mail
        }).success(function(data,status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });

        return d.promise; 
    };

    return {
        getMail : getMail,
        sendEmail : sendEmail
    };
}]);


app.controller('HomeController', ['$scope',function($scope) {
    $scope.selectedMail;

    $scope.setSelectedMail = function(mail) {
        $scope.selectedMail = mail;
    };

    $scope.isSelected = function(mail){
        if($scope.selectedMail){
            return $scope.selectedMail === mail;
        }
    }

}]);

app.controller('MailListingController', ['$scope', 'mailService', function($scope, mailService){
    $scope.email = [];

    mailService.getMail()
    .success(function(data, status, headers){
        console.log(data);
        $scope.emails = data;
    })
    .error(function(data, status, headers){

    });
}]);

app.controller('ContentController', ['$scope','$rootScope','$filter','mailService' ,function($scope,$rootScope, $filter, mailService){
    $scope.showingReply =false;
    $scope.reply ={};

    $scope.toggleReplyForm = function(){
        $scope.showingReply = !$scope.showingReply;
        $scope.reply ={};
        $scope.reply.to = $scope.selectedMail.from
        $scope.reply.message = "\n\n--------------"+$filter('date')($scope.selectedMail.sent_at,'dd/MM/yy')+"--------------\n\n"+$scope.selectedMail.message
    };

    $scope.sendReply = function(){
        $scope.showingReply = false;
        $rootScope.loading = true;
        console.log("in sendReply")
        console.dir($scope.reply);
        console.dir($scope.selectedMail);
        console.dir($scope);
        mailService.sendEmail($scope.reply)
        .then(function(status){
            $rootScope.loading = false;
        },function(err){
            $rootScope.loading = false;
        });
    }

    $scope.$watch('selectedMail', function(evt){
        $scope.showingReply =false;
        $scope.reply = {};
    });

}]);



app.controller('SettingsController', function($scope) {
    $scope.settings = {
        name: "Ari",
        email: "herpderp@gmail.com"
    };

    $scope.updateSettings = function(){
        console.log("Update was called >D");
    }
});
