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

app.service('mailService', ['$http', function($http){
    var getMail = function() {
        return $http({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/emails'
        });
    };

    var sendEmail = function(mail){

    };

    return {
        getMail : getMail
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
        $scope.emails = data;
    })
    .error(function(data, status, headers){

    });
}]);

app.controller('ContentController', ['$scope','$filter','mailService' ,function($scope,$filter,mailService){
    $scope.showingReply =false;
    $scope.reply ={};

    $scope.toggleReplyForm = function(){
        $scope.showingReply = !$scope.showingReply;
        $scope.reply ={};
        $scope.reply.to = $scope.selectedMail.from
        $scope.reply.message = "\n\n--------------"+$filter('date')($scope.selectedMail.sent_at,'dd/MM/yy')+"--------------\n\n"+$scope.selectedMail.message
    };

    $scope.sendReply = function(){
        mailService.sendEmail($scope.reply)
        .then(function(status){

        },function(err){

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