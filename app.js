
angular.module("spxAngular", ['mgcrea.ngStrap.popover'])
	.directive("focusablePopover", ["$timeout",
		function ($timeout) {
			return {
				restrict: "EAC",
				link: function (scope, element, attrs) {
					var $body = angular.element("body");
					var _hide = function () {
						console.log('inside _hide function...');
						if (scope.$hide) {
							scope.$hide();
							scope.$apply();
						} else {
							console.log('no existe $hide()');
						}
					};
					console.log(element);
					console.log(scope);

					
					// Stop propagation when clicking inside popover.
					$timeout(function() {
						element.on("click", function (event) {
							event.stopPropagation();
						});

						// Hide when clicking outside.
						$body.on("click", _hide);

						// Safe remove.
						element.on("$destroy", function () {
							$body.off("click", _hide);
							element.off("click");
						});
					}, 0);
				}
			};
		}
	])
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

		var dynamicPopover = {
		    content: 'Hello, World!',
		    templateUrl: 'overlay1',
		    title: 'Title',
		    placement: "bottom auto",
		    animation: "am-flip-x",
		    trigger: 'manual'
		};

		var myPopover = $popover(angular.element(document.querySelector('#showCartLink')), dynamicPopover);
		$scope.togglePopover = function() {
			var $body = angular.element("body");

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
		$http.get($scope.urlApiRest+'/user/'+$scope.usuario+'/uens').
	            then(function (response) {
	                $scope.uens = response.data;
	            });

	    $http.get($scope.urlApiRest+'/user/'+$scope.usuario+'/messages/count').
	            then(function (response) {
	                $scope.noLeidos = response.data;
	            });

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
			var scrollTimer, lastScrollFireTime = 0;
			$('#cartItems').scroll(function() {
			    var minScrollTime = 1000;
			    var now = new Date().getTime();
			    function processScroll() {
			        console.log(new Date().getTime().toString());
			        console.log('calling scroll...');
			        $scope.showPreviewCarroCompras();
			    }
			    if (!scrollTimer) {
			        if (now - lastScrollFireTime > (3 * minScrollTime)) {
			            processScroll();   // fire immediately on first scroll
			            lastScrollFireTime = now;
			        }
			        scrollTimer = setTimeout(function() {
			            scrollTimer = null;
			            lastScrollFireTime = new Date().getTime();
			            processScroll();
			        }, minScrollTime);
			    }
			});

			$scope.showPreviewCarroCompras();
		};

	});
