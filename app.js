
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

		$scope.myPopover = $popover(angular.element(document.querySelector(popoverOptions.triggerId)), popoverOptions);
		$scope.togglePopover = function() {
			var _hide = function() {
				console.log('cerrando...')
				$scope.myPopover.$promise.then($scope.myPopover.hide());
			}

			if (!$scope.myPopover.$isShown) {
				$scope.myPopover.$promise.then($scope.myPopover.show());
				$scope.myPopover.$element.on("mouseleave", _hide);
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
	})
	.controller("budgetController", function ($scope, $http, $window) {
		$scope.usuario = "RCOTO";
		$scope.urlApiRest= "http://localhost:7001/ApiRestSpx-1.0.0/api/v1";
		$scope.idUen = 88;
		$scope.idCc = 38690;
		$scope.idioma = 'ESA';
		$scope.uen = {};
		$scope.cc = {};
		$scope.budget = {
			size: 0,
			page: 0,	
			last: false,
			content: []
		};
		$scope.periodos = [];
		$scope.transferencia = [];
		$scope.responsable = false;
		$scope.categorias = [];

		console.log('iniciando presupuestos...');
		
	    $scope.showBudget = function() {
	    	if (!$scope.budget.last) {
	    		console.log("mostrando pagina " + $scope.budget.page + " de presupuesto para uen: " + $scope.idUen + " cc: " + $scope.idCc + "...");
		    	$http.get($scope.urlApiRest+'/aprobacion/budget/category?uen='+ $scope.idUen + '&cc=' + $scope.idCc + '&page=' + $scope.budget.page + '&size=50').
		            then(function (response) {
		                $scope.budget.size = response.data.total_elements;
		                angular.push
		                $scope.budget.content.push.apply($scope.budget.content, response.data.content);
		                $scope.budget.page = response.data.number + 1;
		                $scope.budget.last = response.data.last;
		                angular.forEach($scope.budget.content, function(item) {
		                    $scope.transferencia.push({ 
		                    	from: item.id, 
		                    	uen : $scope.idUen, 
		                    	codigo_centro_costo: item.centro_costo,
		                    	periodo : item.periodo,
		                    	categoria : null,
		                    	ammount : null,
		                    	usuario : $scope.usuario
		                    });
		                    $scope.categorias.push({ id : item.id, categoria : item.categoria, nombre : item.nombre_categoria });
		                });
		            });
		    } else {
		    	console.log("ya se llegó al final del presupuesto...");
		    } 
	   };

	    $scope.loadPeriods = function() {
    		console.log("cargando periodos...");
    		$scope.periodos = [];
	    	$http.get($scope.urlApiRest+'/aprobacion/budget/periods?filter=true').
	            then(function (response) {
	                $scope.periodos.push.apply($scope.periodos, response.data);
	            });
	    };

	    $scope.loadUen = function() {
    		console.log("cargando uen " + $scope.idUen + "...");
	    	$http.get($scope.urlApiRest+'/uens/' + $scope.idUen)
	    		.success(function (response) {
	                $scope.uen = response;
	                console.log($scope.uen);
	            })
	            .error(function(status, data){

	            });
	    };

	    $scope.loadCostCenter = function() {
    		console.log("cargando centro de costo " + $scope.idCc + '/' + $scope.idUen + '/' + $scope.idioma + "...");
	    	$http.get($scope.urlApiRest+'/cc/' + $scope.idCc + '/' + $scope.idUen + '/' + $scope.idioma)
	    		.success(function (response) {
	                $scope.cc = response;
	                console.log($scope.cc);
	            })
	            .error(function(status, data){

	            });
	    };

	    $scope.checkUserResponsible = function() {
    		console.log("verificando si usuario es responsable de CC " + $scope.idCc + "...");
	    	$http.get($scope.urlApiRest+'/cc/' + $scope.idCc + '/members/' + $scope.idUen + '/' + $scope.usuario)
	    		.success(function (response) {
	                var member = response;
	                console.log(member);
	                if (member.relacion === 'Resp')
	                	$scope.responsable = true;
	            })
	            .error(function(status, data){
	            	console.log('Error response: ' + data)	;
	            });
	    };

	    $scope.printTransfer = function() {
	    	console.log($scope.transferencia);
	    };

	    $scope.transferBudget = function() {
	    	//aqui hay que enviar el array de transferencia 
	    	console.log($scope.transferencia);
	    	data = $scope.transferencia.filter(item => item.periodo != null && item.categoria != null && item.ammount > 0);
	    	console.log(data);
	    	if(data.length > 0) {
	    		console.log(angular.toJson(data, true));
	    		$http.post($scope.urlApiRest+'/aprobacion/budget/transfer', data)
	    			.success(function() {
	    				angular.element(document.querySelector('#myModal')).modal('hide');
	    			})
	    			.error(function(status, data) {
	    				console.log('transferencia fallida!!!');
	    			})
	    	}
	    };

	    $scope.initBudget = function() {
	    	$scope.budget = {
	    		size: 0,
	    		page: 0,	
	    		last: false,
	    		content: []
	    	};
	    	$scope.transferencia = [];

	    	$scope.loadUen();
	    	$scope.loadCostCenter();

	    	$scope.showBudget();

	    	$scope.loadPeriods();
	    	$scope.checkUserResponsible();
		};
	})
	.filter('notSameCategory', function() {
		return function(input, excludeId) {
			var out = [];
			angular.forEach(input, function(item) {
				if (item.id !== excludeId) {
					out.push(item);
				}
			});
			return out;
		}
	});