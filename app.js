
angular.module("spxAngular", ['mgcrea.ngStrap.popover'])
	.directive('onScrollToBottom', function ($document) {
	    //This function will fire an event when the container/document is scrolled to the bottom of the page
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            element.bind("scroll", function () {
	            	console.log(element[0].scrollTop + element[0].offsetHeight);
	                if (element[0].scrollTop + element[0].offsetHeight >= element[0].scrollHeight) {
	            		console.log('scrolling...');
	                    //run the event that was passed through
	                    scope.$apply(attrs.onScrollToBottom);
	                }
	            });
	        }
	    };
	})
	.controller("uenController", function ($scope, $http) {
		$scope.message = "Yo mismo";
		$scope.uens = [];
		$scope.idUen = null;
		$scope.usuario = "OLIP";
		$scope.noLeidos = 0;
		$scope.urlApiRest= "http://localhost:7001/ApiRestSpx-1.0.0/api/v1";

		console.log('iniciando aqui!!');
		$http.get($scope.urlApiRest+'/user/'+$scope.usuario+'/uens').
	            then(function (response) {
	                $scope.uens = response.data;
	            });

	    $http.get($scope.urlApiRest+'/user/'+$scope.usuario+'/messages/count').
	            then(function (response) {
	                $scope.noLeidos = response.data;
	            });

	    $scope.updateUens = function() {
	    	console.log("actualizando lista de uens para " + $scope.usuario + "...");
	    	$http.get($scope.urlApiRest+'/user/'+$scope.usuario+'/uens').
	            then(function (response) {
	                $scope.uens = response.data;
	            });
	    };
	})
	.controller("cartController", function ($scope, $http, $popover) {
		$scope.usuario = "OLIP";
		$scope.urlApiRest= "http://localhost:7001/ApiRestSpx-1.0.0/api/v1";
		$scope.resourcesUrl = "http://192.168.40.5/appsmet/resources/compras";
		$scope.shoppingCart = {
			size: 0,
			page: 0,
			last: false,
			content: []
		};

		var popoverOptions = {
		    content: 'Hello, World!',
		    templateUrl: 'overlay1',
		    title: 'Title',
		    placement: "bottom auto",
		    animation: "am-flip-x",
		    trigger: 'manual',
		    triggerId: '#showCart'
		};

		var myPopover = $popover(angular.element(document.querySelector(popoverOptions.triggerId)), popoverOptions);
		$scope.togglePopover = function() {
			var _hide = function() {
				console.log('cerrando...')
				myPopover.$promise.then(myPopover.hide());
			}

			if (!myPopover.$isShown) {
				myPopover.$promise.then(myPopover.show());
				myPopover.$element.on("mouseleave", _hide);
			}
		};

		console.log('iniciando carro compras...');
		
	    $scope.showPreviewCarroCompras = function() {
	    	if (!$scope.shoppingCart.last) {
	    		console.log("mostrando pagina " + $scope.shoppingCart.page + " de carro para " + $scope.usuario + "...");
		    	$http.get($scope.urlApiRest+'/cart/preview/'+$scope.usuario + '?page=' + $scope.shoppingCart.page).
		            then(function (response) {
		                $scope.shoppingCart.size = response.data.total_elements;
		                $scope.shoppingCart.content.push.apply($scope.shoppingCart.content, response.data.content);
		                $scope.shoppingCart.page = response.data.number + 1;
		                $scope.shoppingCart.last = response.data.last;
		            });
		    } else {
		    	console.log("ya se llegó al final del carro...");
		    } 
	    };

	    $scope.initModule = function() {
			$scope.showPreviewCarroCompras();
		};
	});
