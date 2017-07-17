
angular.module("spxAngular", ['mgcrea.ngStrap.popover'])
	.directive("focusablePopover", ["$timeout",
		function ($timeout) {
			return {
				restrict: "EAC",
				link: function (scope, element, attrs) {
					var $body = angular.element("body");
					var _hide = function () {
						if (scope.$hide) {
							scope.$hide();
							scope.$apply();
						}
					};
					console.log('inside directive')
					// Stop propagation when clicking inside popover.
					$timeout(function() {
						element.on("click", function (event) {
							event.stopPropagation();
						});

						// Hide when clicking outside.
						$body.one("click", _hide);

						// Safe remove.
						scope.$on("$destroy", function () {
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
	.controller("cartController", function ($scope, $http) {
		$scope.usuario = "OLIP";
		$scope.urlApiRest= "http://localhost:7001/ApiRestSpx-1.0.0/api/v1";
		$scope.resourcesUrl = "http://192.168.40.5/appsmet/resources/compras";
		$scope.shoppingCart = {
			size: 0,
			page: 0,
			last: false,
			content: []
		};

		$scope.dynamicPopover = {
		    content: 'Hello, World!',
		    templateUrl: 'overlay.html',
		    title: 'Title'
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

			$('.popover').on("mouseleave", function(){
				$(el).popover("hide");
			});

			$scope.showPreviewCarroCompras();
		};
	});


// $('#showCartLink').on("mouseover", function(){
// 	console.log( $('on mouseover'));
// 	$('#showCartLink').popover("show");
// 	console.log( $('.popover-content'));
// 	$('.popover-content').scroll(function() {
// 		var div = $(this);
// 		console.log("entró",div,div.height(),div.scrollTop());
// 		if (div.height() == div.scrollTop() + 1) {
// 		  alert("Reached the bottom!");
// 		}
// 	});              
// 	$('.popover').on("mouseleave", function(){
// 		$(el).popover("hide");
// 	});
// });