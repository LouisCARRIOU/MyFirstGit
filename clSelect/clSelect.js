/*!
* clSelect
* (c) 2014 Louis CARRIOU
*
*
*
*
* TODO:
*		=> Désactiver le tri des éléments lorsqu'il n'y a qu'un seul élément dans la liste
*		=> Faire option de racourcir le texte et mettre ... si le texte dépasse le conteneur et lorsqu'il y a ... on met un tooltip qui permet de visualiser l'ensemble
*		
*		=> rendre possible de drag & drop d'une liste a l'autre en connectant les liste. (ajouter option: connectWith=> liste de plugin avec lequel l'element est connecté)
*	
*/


(function ($) {

	// Options
		const PLUGIN_NAME = 'clSelect';
		const ALL = '*';

		var defaults = {

	    	// Config Général (image, vue)
		    	imagesSrc:"../../images/",
		    	images:{
		    		remove: "icones/close.png",								// Image du bouton pour supprimer un élément
		    		add:"icones/add.png",									// Image du bouton pour ajouter un element
		    		error:"AlertMsg/Information.png",						// Image du bouton lorsque le contenu à ajouter est vide
		    		//empty:"AlertMsg/Information.png",						// Image du bouton lorsque le contenu à ajouter est vide
		    		//unique:"AlertMsg/Information.png" 						// Image du bouton lorsque le contenu à ajouter éxiste déjà
		    	},
				view: 'column',												// "row" ou "column"
			
			// Gestion de la selection
				multi: false, 												// true/-1 => Sélection multiple possible, false=> selection multiple impossible, number=> nombre de selection maximum
				ctrlKey: false, 											// La sélection multiple (si il est possible) ce fait par l'appui de ctrl. Sinon si sélection simple permet de désactiver le bouton
				shiftKey: false, 											// La sélection multiple de tous le éléments entre le dernier élément cliqué et le cliqué
				unselectOnClickOut: false,									// boolean ou fonction retournant un boolean Permet de déselectionner l'ensemble si l'on click en dehors de l'element
			
			// Configuration (indicateur, suppression, déplaceable, éditable)
				indicator: true, 											// Indicateur vert rouge pour savoir si c'est sélectionner ou non (si 'before' alors l'indicateur se situera avant le contenu, si 'after' alors celà place l'indicateur après, si true place avant en mode colonne et après en mode ligne)
				removable:true,												// Permet d'ajouter un bouton qui permet de supprimer les element
				editable: true,												// TODO Permet de modifier la valeur du label lorsque l'on double click sur l'element
				sortable:false,												// Permet de déplacer l'element de la liste
			
			// Configuration pour l'ajout d'element
				addable: false,												// Permet d'ajouter une zone de saisie pour ajouter des éléments, peut etre une fonction, un objet déterminant l'arborecense des data , un tableau, un element jQuery
				unique : true,												// Permet de n'ajouter que de nouvelles entrés (valeurs distinctes) , peut etre une fonction qui permet de déterminer la chaine de charactere comparative
				empty: false,												// Interdit ou non l'ajout d'element vide, => true : autorise l'ajout vide, => false : autorise aucun champ vide , function => appellé pour chaqu'un des éléments afin de déterminer si la valeur actuelle est autorisé ou non, Tableau => éléments jquery qu'il faut vérifier

			// Valeurs et elements selectionnés
				value: [],													// Ensemble des valeurs souhaité => Tableau: ensemble des informations souhaité, => Objet: configuration de requete ajax
				disabled: [],												// 
				selected: [],												// 

			// Navigation des éléments			
				tabNav: true,												// True => Permet de naviguer à l'aide de la touche tab dans le select , false => Ne navigue pas dans le select et passe à l'element suivant
				keyNav: true,												// True => Permet de naviguer à l'aide des flèches directionnelles dans le select

			// Méthodes
				// Lié à la creation du plugin
					beforeCreating: function(opt){},						// Fonction appellé au démarrage de la création du plugin
					afterCreating: function(opt){},							// Fonction appellé à la fin de la création du plugin

				// Lié au rendu
					beforeRendering: function(ui, data) {},					// Fonction appellée avant la création d'un élément (si retourne false alors cela annule la creation, sinon la valeur de retour correspond au nouvelle datas)
					afterRendering: function(ui, data) {}, 					// Fonction appellée après de la création d'un élément
					
					createLabel: function(ui,data) {},						// Fonction permettant de créer la valeur du label de la data  => valeur de renvoie = la valeur du label souhaité

				// Lié aux ajouts de datas
					checkDatas:true,
					change: function(){},									// Fonction appellée lorsqu'il y a modification dans les champs pour ajouter un élément

					beforeAdding : function(ui,data){},						// Fonction appellée avant l'ajout d'élément (permet de modifier les data et d'accepter ou non l'ajout).
					afterAdding : function(ui,data){},						// Fonction appellée avant l'ajout d'élément (permet de modifier les data et d'accepter ou non l'ajout).
					
				// Lié aux actions sur élément
					beforeRemoving : function(ui,data){},					// Fonction appellée avant la suppréssion d'élement (si retourne false, alors ne supprime pas l'element).
					afterRemoving : function(ui,data){},					// Fonction appellée après la suppréssion d'élément.

					
					beforeEdditing: function(ui,data){},					// TODO Fonction appellée avant le souhait d'édition d'un objet. (si la fonction retourne false alors cela bloque l'edition)
					afterEdditing: function(ui,data){},						// TODO Fonction appellée après l'édition d'un objet.

				// (de)Selection
					beforeSelect : function(){},							// Fonction appellée avant la selection d'élément
					afterSelect: function(){},								// Fonction appellée après la selection d'élément
					
					beforeUnselect : function(){},							// Fonction appellée avant la déselection d'élément
					afterUnselect: function(){},							// Fonction appellée après la déselection d'élément
				
				// (des)Activation
					beforeDisable : function(){},							// Fonction appellée avant la désactivation d'élément
					afterDisable : function(){},							// Fonction appellée après la désactivation d'élément
					
					beforeEnable : function(){},							// Fonction appellée avant l'activation d'élément
					afterDisable : function(){},							// Fonction appellée après l'activation d'élément
				
				// Focus/blur
					beforeFocus : function(){},								// Fonction appellée avant la mise du focus sur l'élément
					afterFocus : function(){},								// Fonction appellée après la mise du focus sur l'élément
					
					beforeBlur : function(){},								// Fonction appellée avant la perte du focus de l'élément
					afterBlur : function(){},								// Fonction appellée après la perte du focus de l'élément
				
				// Valeurs
					setValue: null,											//function(wanted, data, compare){}
					keepValue : true,										// Permet de conserver les ancienne valeur avant ou non 
					typeValue : 'select',									//'data'=> Récupère/place l'ensemble des datas de la liste ,'select'=> Récupère/place l'ensemble des datas sélectionné, 'unselect', 'disable', 'focus'
					getValue: null,											//function(ui,data,data){},	

			// Texte
				text:{
					tooltip_uniqueSolution: "La solution est déjà présente dans la liste",
					tooltip_emptySotution: "La valeur en entrée est vide, veuillez saisir une information",

					class_container:"",										// Class associé au conteneur
					class_listContainer:"",									// Class associé au conteneur de la liste d'elements
					class_removeBtn:"",										// Class associé au bouton de suppression d'un élement
					class_selectedElement:"",								// Class associé aux boutons sélectionnés
					class_disableElement:"",								// Class associé aux boutons désactivé
					class_focusElement:"",									// Class associé aux boutons focus
					class_cloneElement : "",								// Class associé aux clones de boutons (lorsqu'il y a drag pour changer l'emplacement)
					class_element:"",										// Class associé aux boutons
					
					attr_label:"label",
					attr_disabled:"disabled",
					attr_focused:"focused",
					attr_selected:"selected",
					attr_removable:"removable",
					attr_indicator:"indicator"

				}
	    };

	// Liens de fonctions jquery <=> plugin
		// Permet de remplacer les fonctionnalités d'élement jquery par celle du plugin
		//  - Chaine de charactere => le nom de la fonction jquery = fonction plugin
		//  - Objet => l'attribut correspond au nom de la fonction jquery, la valeur associé correspond a la fonction du plugin
		var fctNames = [
			"datas",
			"val",
			"refresh",
			"focus",
			"change",
			"blur",
			{unfocus:"blur"},
			'destroy'
		];
		
	// Fonction utile

	    // Recursively combines option hash-objects
	    // Better than `$.extend(true, ...)` because arrays are not traversed/copied
	    //
	    // called like:
	    // mergeOptions(target, obj1, obj2, ...)
	    function mergeOptions(target) {
	        function mergeIntoTarget(name, value) {
	            if ($.isPlainObject(value) && $.isPlainObject(target[name])) { // && !isForcedAtomicOption(name)) {
	                // merge into a new object to avoid destruction
	                target[name] = mergeOptions({}, target[name], value); // combine. `value` object takes precedence
	            }
	            else if (value !== undefined) { // only use values that are set and not undefined
	                target[name] = value;
	            }
	        }
	        for(var i = 1; i < arguments.length; i++) {
	            $.each(arguments[i], mergeIntoTarget);
	        }
	        return target;
	    }

	    // Liaison des fonctionnalité jquery / plugin
	    var oldFct = {};
		for(var i = 0; i<fctNames.length; i++){
			var jqueryName = fctNames[i];
			var pluginName = jqueryName;
			if($.isPlainObject(fctNames[i])){
				jqueryName = Object.keys(fctNames[i])[0]
				pluginName = fctNames[i][jQuery];
			}
			oldFct[jqueryName] = $.fn[jqueryName];
			$.fn[jqueryName] = newJQueryFunction(jqueryName,pluginName);
		}

		function newJQueryFunction(jqueryName, pluginName) {
		    return function() { 
		    	if($(this).data(PLUGIN_NAME)) 						return $(this)[PLUGIN_NAME](true,pluginName,arguments);
                else if(typeof oldFct[jqueryName] == 'function') 	return oldFct[jqueryName].apply(this,arguments);
		    };
		}

	// Définition générales du plugin

		// Pour créer a partir de rien
		$[PLUGIN_NAME] = function(options) {
			var $myNewElement = $("<div>");
			$(document.body).append($myNewElement);
			var tmp = $myNewElement[PLUGIN_NAME](options);
			if(tmp===false) $myNewElement.remove();
			return tmp;
		}

	    $.fn[PLUGIN_NAME] = function (options) {
	    	if(options === "default"){
	    		options = arguments[1];
	    		if(typeof options == "undefined") return defaults;
		    	else if(typeof options == "string" && typeof arguments[2] != "undefined"){
		    		var myNewOpt = {}; 
		    		myNewOpt[options] = arguments[2];
		    		mergeOptions(defaults,myNewOpt)
		    	}else if($.isPlainObject(options)){
		    		mergeOptions(defaults,options)
		    	}
	    	}
	    	else{
		        var args = Array.prototype.slice.call(arguments, 1); // for a possible method call
		        var res = this; // what this function will return (this jQuery object by default)
		        this.each(function (i, _element) { // loop each DOM element involved
		            var element = $(_element);
					var mapping = element.data(PLUGIN_NAME); // get the existing mapping object (if any)
		            
		            // Si l'on a passé les argument en mode apply
		            if(typeof options === 'boolean' && options === true){
		            	options = args[0];
		            	args = args[1];
					}

		            if (typeof options === 'string') {
		                if (mapping && $.isFunction(mapping[options])) {
		                    var singleRes = mapping[options].apply(mapping, args);
		                    if (!i) {
		                        res = singleRes; // record the first method call result
		                    }
		                    if (options === 'destroy') { // for the destroy method, must remove Mapping object data
		                        element.removeData(PLUGIN_NAME);
		                    }
		                }
		            }
		            // a new mapping initialization
		            else if (!mapping) { // don't initialize twice
		                mapping = new Mapping(element, options);
		                res = mapping.render();
						element.data(PLUGIN_NAME, mapping);
		                res.data(PLUGIN_NAME, mapping);
		            }
		        });
		        return res;
		    }
	    };
	    
	    // Permet de modifier les valeurs par defaut en restant à l'exterieur du plugin
	    $.fn[PLUGIN_NAME].defaults = defaults;

	// Mapping du plugin

	    function Mapping(element, instanceOptions) {
	        var t = this;
	        // Build options object
	        // -----------------------------------------------------------------------------------
	            instanceOptions = instanceOptions || {};
	            var options = mergeOptions({}, $.fn[PLUGIN_NAME].defaults, instanceOptions);

	        // Exports
			// -----------------------------------------------------------------------------------
		        t.options = function(){return options};
		        t.render = render;
		        t.destroy = destroy;
		        t.changeView = changeView;

				t.add = add;								// Permet d'ajouter un element a la liste
				t.remove = remove;							// Permet de supprimer un element de la liste

				t.select = select;							// Permet de selectionner
				t.unselect = unselect;						// Permet de déselectionner

				t.disable = disable;						// Permet de désactiver un élément
				t.enable = enable;							// Permet d'activer un élément

				t.enableSort = enableSort;					// Permet de d'activer le drag&drop afin de déplacer les position des élément
				t.disableSort = disableSort;				// Permet de désactiver le drag&drop afin de déplacer les position des élément

				t.refresh = refresh;
				t.val = val;								// Permet de selectionner ou de récupérer les éléments sélectionner
				t.datas = datas;								// Permet de creer ou de récupérer les éléments de la liste
				t.focus = focus;							// Permet de mettre le focus sur un élément souhaité
				t.blur = blur;								// Permet d'enlever le focus

	        // Locals
	        // -----------------------------------------------------------------------------------
				var _element = element[0];
				var $container 	= element;
				var $buttonContainer ;
				var $addContainer;
				var $buttonAdding;

				var curDatas		 = [] 	// Tableau contenant l'ensembles des boutons ajoutés ainsi que leurs datas
				var curAddElements;			// Arboressanse disposant l'ensemble des jQuery de l'element  
				var lastButtonIndex	 = -1; 	// Utile pour selection multiple par shift 
				var overList = false; 		// Permet de savoir si le curseur est au dessus ou non de la liste
				
				var lastEvent;				// Utile pour savoir si avant le focus sur le container , on navigue avec tab ou maj+tab

			// Main Rendering
	        // -----------------------------------------------------------------------------------
	            function render() {
					var tmp = (typeof options.beforeCreating == "function") ? options.beforeCreating.call($container,options) : true;
					if(tmp === false) return false; // On s'arrete la
					
					$container
						.addClass(PLUGIN_NAME+" " + options.text.class_container)
					
					addNavEvent();

					// Creation du conteneur de boutons
					renderButtonContainer()

					// Ajout des evenements
					addEvent();

					// Ajout du conteneur d'ajout si souhaité
					renderAddContainer();
					curAddElements = setAddContainer(options.addable);
					changeAddValue();

					refresh();	
					
					if(typeof options.afterCreating == "function") options.afterCreating.call($container,options);
					
					// Utile pour renvoyer le nouvel objet remplacant celui appelant
					return $container;
				}

				function clear(){
					for(var i = curDatas.length-1; i>=0; i--){
						curDatas[i].remove(false);
						delete curDatas[i];
					}
					curDatas[i] = [];
				}

				function refresh(){
					clear();

					// Chargement des boutons
					add(options.value);
					select(options.selected);
					disable(options.disabled);

					// Mise à jours de la vue souhaité
					changeView(options.view)
				}

				function addNavEvent(){
					$(document.body).on("keydown",function(e){lastEvent = e})
					$container
						.attr('tabindex','0')
						.blur(function(){
							blur(null);
						})
						.focus(function(){
							var curFocus = focus(undefined,defaultGetValue);
							if(options.tabNav==false){
								curDatas[0].focus();
							}
							else if(options.tabNav == true && curFocus==undefined && lastEvent.shiftKey==true){
								curDatas[curDatas.length-1].focus();
							}
							else if(options.tabNav == true && curFocus==undefined && lastEvent.shiftKey==false){
								curDatas[0].focus();
							}
						})
						.on("keydown",function(e){
							var curFocusElement = focus(undefined,defaultGetValue);
							// Si on appui sur tab et que l'on autorise la navigation interne 
							// alors on met le focus l'element suivant de la liste
							if(options.tabNav==true && e.keyCode==9 && e.shiftKey==false){
								if(curFocusElement+1 < curDatas.length){
									curDatas[curFocusElement+1].focus();
									e.stopPropagation();
									return false;
								}else{
									curDatas[curFocusElement].blur();
								}
							}
							// Si on appui sur maj + tab et que l'on autorise la navigation interne 
							// alors on met le focus l'élément précédent de la liste
							else if(options.tabNav==true && e.keyCode==9 && e.shiftKey==true){
								if(curFocusElement-1 >= 0){
									curDatas[curFocusElement-1].focus();
									e.stopPropagation();
									return false;
								}else{
									curDatas[curFocusElement].blur();
								}
							}
							else if(curFocusElement!= undefined){
								var myElement = curDatas[curFocusElement] 
								if(e.keyCode==32 || e.keyCode==13){
									myElement.$el.click();
									e.stopPropagation();
									return false;
								}
								// Si on appui sur tab et que l'on n'autorise pas la navigation interne 
								// alors on met le focus sur le dernier element pour que l'action fasse passer a l'element suivant
								else if(options.tabNav==false && e.keyCode==9 && e.shiftKey==false){
									curDatas[curDatas.length-1].focus();
								}
								// Si on appui sur maj + tab et que l'on n'autorise pas la navigation interne 
								// alors on met le focus sur le premier element pour que l'action fasse passer a l'element précédent
								else if(options.tabNav==false && e.keyCode==9 && e.shiftKey==true){
									curDatas[0].focus();
								}

								// Si on appui sur haut ou gauche et qu'il y a ctrlKey et que l'on peut déplacer les élément
								// Alors on déplace l'élément avec celui de gauche
								else if(options.sortable && e.ctrlKey && (e.keyCode == 38 || e.keyCode == 37)){ 
									$(this).data("data").move(myElement.id-1);
									e.stopPropagation();
									return false;
								}
								// Si on appui sur bas ou droite et qu'il y a ctrlKey et que l'on peut déplacer les élément
								// Alors on déplace l'élément avec celui de droite
								else if(options.sortable && e.ctrlKey && (e.keyCode == 39 || e.keyCode == 40)){ 
									$(this).data("data").move(myElement.id+1);
									e.stopPropagation();
									return false;
								}
								// Si on appui sur haut ou gauche  et que l'on peut naviguer parmis les élément
								// Alors on déplace le focus vers l'element précédent
								else if(options.keyNav && (e.keyCode == 38 || e.keyCode == 37)){
									if( (myElement.id-1) >= 0 ) curDatas[myElement.id-1].focus();
									else 						curDatas[curDatas.length-1].focus();
									e.stopPropagation();
									return false;
								}
								// Si on appui sur bas ou droite  et que l'on peut naviguer parmis les élément
								// Alors on déplace le focus vers l'element suivant
								else if(options.keyNav && (e.keyCode == 39 || e.keyCode == 40)){
									if( (myElement.id+1) < curDatas.length ) curDatas[myElement.id+1].focus();
									else 										curDatas[0].focus();
									e.stopPropagation();
									return false;
								}
								// Si on appui sur supprimer et que l'on autorise la suppréssion alors on supprime l'element
								else if(options.removable && e.keyCode == 46){
									myElement.$removeBtn.click();
								}
								//return curDatas[curFocusElement].$el.keydown()

							}
						})
				}

				function destroy(){
					$container.remove();
				}

				function changeView(view){
					if(typeof view == "undefined"){
						view = (options.view == "row")? "column" : "row";
					}
					$container.removeClass(options.view+"View")
					$container.addClass(view+"View")
					options.view = view;
				}

				function renderButtonContainer(){
					$buttonContainer = $("<span>")
						.addClass("listContainer "+options.text.class_listContainer)
						.appendTo($container)
					if(typeof $.fn.sortable == "function"){
						$buttonContainer.sortable({
							helper: function(e,$el){return $el.clone().addClass("clone "+options.text.class_cloneElement)},
							revert: true,
							scrollSensitivity: 5,
							scrollSpeed: 5,
							appendTo: $container,
							stop: function(event, ui) {
								ui.item.data("data").move(ui.item.index());
							}
						})
					}

					return $buttonContainer; 
				}

				function renderAddContainer(){
					$buttonAdding = $("<div>")
						.addClass("button")
						.click(addFromButton)
						.append(
							$("<img class='add' src='"+ options.imagesSrc + options.images.add +"'>"),
							$("<img class='error' src='"+ options.imagesSrc + options.images.error +"'>")
							//$("<img class='unique' src='"+ options.imagesSrc + options.images.unique +"'>"),
							//$("<img class='empty' src='"+ options.imagesSrc + options.images.empty +"'>")
						);
					$addContainer = $("<div>")
						.addClass("addContainer");
				}

			// Evenement
			// -----------------------------------------------------------------------------------
				function addEvent(){

					// Ajout de la possibilité de déplacer ou non les éléments de la liste
					if(options.sortable===false) disableSort();

					// Ajout de la fonction de désactivé la selection lors d'un click exterieur au plugin
					$container
						.on("mouseover",function (){overList = true})
						.on("mouseout",function (){overList = false})
					$(document.body).click(function(){
                        if(overList!=true){
                        	var tmp = options.unselectOnClickOut;
                        	if(typeof tmp == "function" ) tmp = tmp();
                        	if(tmp!==false){
                            	unselect();
                           	}
                        }
                    })
				}

				function changeAddValue(){
					var res = true;
					if(typeof options.checkDatas=="function"){
						res = options.checkDatas();
					}else if(typeof options.checkDatas == "boolean" || typeof options.checkDatas == "string"){
						res = options.checkDatas;
					}

					if(res==true){
						if(options.unique!==false && isUniqueValue()==false){
							res = options.text.tooltip_uniqueSolution;
						}else if(options.empty!=true && isEmptyValue()==true){
							res = options.text.tooltip_emptySotution;						
						}else{
							res = false;
						}
					}

					if(typeof res == "string"){
						$addContainer.addClass("error");
					}else if(res === true){
						$addContainer.addClass("error");
					}else{
						$addContainer.removeClass("error");
					}

					// if(options.unique!==false && isUniqueValue()==false){
					// 	$addContainer.addClass("unique");
					// }else{
					// 	$addContainer.removeClass("unique");
					// }

					// if(options.empty!=true && isEmptyValue()==true){
					// 	$addContainer.addClass("empty");
					// }else{
					// 	$addContainer.removeClass("empty");
					// }

					if(typeof options.change=="function") options.change.call($container)
				}

			// Méthodes liés à la possibilité d'ajout d'éléments dans la liste
			// -----------------------------------------------------------------------------------

				/**
				 * \fct setAddContainer
				 * \brief Permet d'ajouter
				 */
				function setAddContainer(conf,clear){
					
					var pushAddElement = function($el){
						$el.on("change input",changeAddValue);
						$el.change(changeAddValue)
						$el.on("keypress",function(){
							// Lors d'appui sur ENTRER <=> Appui sur le bouton
							if(event.keyCode==13){
								$buttonAdding.click();
							}
							changeAddValue()
						})
						$addContainer.append($el,$buttonAdding);
						return $el;
					}

					if(conf == true || ($.isArray(conf) && conf.length==1)){
						$addContainer.addClass("oneInput")
					}else{
						$addContainer.removeClass("oneInput")
					}

					return function myRecFct (conf,clear){
						$addContainer.appendTo($container);
						if(typeof conf == "undefined" || conf == false){
							$addContainer.detach();
							return false;
						}
						else if(typeof conf == "function"){
							return myRecFct(conf(),clear);
						}
						else if($.isArray(conf)){
							var res = [];
							for(var i=0; i<conf.length; i++){
								var myElement = myRecFct(conf[i],false)
								if(myElement !=false){
									res.push(myElement);
								}
							}
							return res;

						}else if(conf instanceof jQuery){
							return pushAddElement(conf);
						}
						else if($.isPlainObject(conf)){
							var res = {}
							for(var attr in conf){
								var myElement = myRecFct(conf[attr],false)
								if(myElement !=false){
									res[attr] = myElement;
								}
							}
							return res;
						}
						else if(conf ===true){
							return pushAddElement($("<input class='input'>"));
						}
						// Nombre ou chaine de charactère
						else{
							$addContainer.append($("<span>").html(conf),$buttonAdding);
							return false;
						}
					}(conf,clear);					
				}

				/**
				 * \fct getAddValue
				 * \brief Permet de récupérer l'ensemble des valeurs des éléments du addContainer afin d'ajouter 
				 */
				function getAddValue(element){
					if(typeof element == "undefined") {
						return getAddValue(curAddElements);
					}

					else if($.isArray(element)){
						var res = [];
						for(var i=0; i<element.length; i++){
							var myValue = getAddValue(element[i],false)
							if(myValue !=false){
								res.push(myValue);
							}
						}
						return res;

					}

					else if(element instanceof jQuery){
						return element.val();
					}

					else if($.isPlainObject(element)){
						var res = {}
						for(var attr in element){
							var myValue = getAddValue(element[attr],false)
							if(myValue !=false){
								res[attr] = myValue;
							}
						}
						return res;
					}
					else return "";
				}

				/**
				 * \fct clearAddValue
				 * \brief Permet de vider les champs qui permettent d'ajouter les valeurs
				 */
				function clearAddValue(element){
					if(typeof element == "undefined") {
						clearAddValue(curAddElements);
					}

					else if($.isArray(element)){
						for(var i=0; i<element.length; i++){
							var myValue = clearAddValue(element[i],false)
							if(myValue !=false){
								res.push(myValue);
							}
						}

					}

					else if(element instanceof jQuery){
						element.val("");
					}

					else if($.isPlainObject(element)){
						var res = {}
						for(var attr in element){
							var myValue = clearAddValue(element[attr],false)
							if(myValue !=false){
								res[attr] = myValue;
							}
						}
					}
				}

				/**
				 * \fct isUniqueValue
				 * \brief Permet de déterminer si les valeurs saisie que l'on souhaite ajouter comme élément sont déjà présent dans la liste ou non
				 */
				function isUniqueValue(value){
					var res = true;
					if(typeof value == "undefined") value = getAddValue();

					var defaultValueCompare = function (a,b){
						if($.isPlainObject(a) || $.isArray(a)){
							if($.isPlainObject(b) || $.isArray(b)) return JSON.stringify(a) != JSON.stringify(b);
							else return true;
						}else{
							return a != b;
						}
					}

					var compareFct = typeof options.unique == 'function' ? options.unique : defaultValueCompare;
					for(var i = 0 ; i < curDatas.length; i++){
						if(!compareFct(curDatas[i].data,value)){
							res = false;
							break;
						}
					}
					return res;
				}

				/**
				 * \fct isEmptyValue
				 * \brief Permet de déterminer si les valeurs saisie que l'on souhaite ajouter comme élément sont vide ou non
				 */
				function isEmptyValue(element){

					var defaultEmptyValue = function (a){
						if($.isArray(options.empty)){
							for(var i=0; i<options.empty.length; i++){
								if(a.is(options.empty[i])){
									return $.trim(a.val())=="";
								}
							}
							return false;
						}
						return $.trim(a.val())=="";
					}
					var isEmptyFct = typeof options.empty == 'function' ? options.empty : defaultEmptyValue;
					
					if(typeof element == "undefined") {
						return isEmptyValue(curAddElements);
					}

					else if($.isArray(element)){
						var res = true;
						for(var i=0; i<element.length; i++){
							var myValue = isEmptyValue(element[i])
							if(myValue == false){
								res = false;
								break;
							}
						}
						return res;
					}

					else if(element instanceof jQuery){
						return isEmptyFct(element);
					}

					else if($.isPlainObject(element)){
						var res = true
						for(var attr in element){
							var myValue = isEmptyValue(element[attr],false)
							if(myValue == false){
								res = false;
								break;
							}
						}
						return res;
					}
					return false;
				}

				/**
				 * \fct addFromButton
				 * \brief Fonction appelé par le bouton d'ajout d'éléments
				 */
				function addFromButton(e){
					var myVal = getAddValue();
					var tmp = (typeof options.beforeAdding == "function") ? options.beforeAdding.call($container,myVal) : true;
					if(tmp === false) return; // On s'arrete la
						
					if(options.unique!==false && isUniqueValue(myVal)==false){
						console.error("La valeur saisie est déjà présente dans la liste (option interdit les doublons).");
					}
					else if(options.empty!==true && isEmptyValue()==true){
						console.error("Aucune valeur n'a été saisie (option interdit les valeurs vide).");
					}
					else{
						var specificCheck = typeof options.checkDatas=="function" ? options.checkDatas() : true;
						if( specificCheck != true){
							console.error("Une erreur spécifique à été détectée.",specificCheck)
						}else{
							var myElement = add(myVal);
							clearAddValue();
							if(typeof options.afterAdding=="function") options.afterAdding.call($container,myElement,myVal);
						}
					}
				}

			// Méthodes par défaut
			// -----------------------------------------------------------------------------------
				function defaultSetValue(data,wanted){
					
					var curData = data instanceof listElement ? data.data : data;


					if(typeof curData != typeof wanted){
						return false;
					}else if($.isArray(curData)){
						if(curData.length != wanted.length) return false;
						var res = true;
						for(var i = 0 ; i<curData.length; i++){
							if(defaultSetValue(curData[i],wanted[i])==false){
								res = false;
								break;
							}
						}
						return res;
					}else if($.isPlainObject(curData)){
						var keys = Object.keys(curData);
						if(keys.length != Object.keys(wanted).length) return false;
						var res =true;
						for(var i = 0; i< keys.length; i++){
							var curK = keys[i];
							if( ! (curK in wanted)  || defaultSetValue(curData[curK],wanted[curK]) == false){
								res = false;
								break;
							} 
						}
						return res;
					}
					return curData==wanted;
				}

				function defaultGetValue(ui){
					return ui.id;
				}

			// Méthodes globale
			// -----------------------------------------------------------------------------------
				
				function getElement(element,callFunction){
					var res = false;
					if($.isArray(element)){
						res = [];
						for(var i =0; i<element.length; i++){
							res.push(getElement(element[i]));
						}
					}
					// Element est une listElement
					else if(element instanceof listElement){
						res = element;
					}
					// Jquery element
					else if(element instanceof jQuery){
						var myElement = element.data("data")
						if(myElement instanceof listElement)	res = myElement;
						else 									res = false;
					}
					// Indice d'un element
					else if($.isNumeric(element)){
						if(element in curDatas)	res = curDatas[element];
						else 					res = false;
					}
					// Element est null ou correspond à la référence à ALL alors on réalise l'action pour tous les élément
					else{
						res = [];
						for(var i = 0; i< curDatas.length; i++){
							// TOREMOVE
							// var myFct = (typeof callFunction != "undefined")  ? callFunction : options.getValue;
							// if(typeof myFct != 'function') myFct = defaultGetValue;
							// var myData = myFct.call($container,curDatas[i],curDatas[i].data);
							// if(typeof myData != "undefined" ) res.push(myData);
							var myData =curDatas[i].val();
							if(typeof myData != "undefined" ) res.push(myData);
						}
					}
					return res;
				}

				/**
				 *
				 * \brief Fonction appellée par les fonction publique
				 */
				function globalPublicFunction(action,element,callFunction){
					var res = $container;
					if($.isArray(element)){
						for(var i =0; i<element.length; i++){
							globalPublicFunction(action,element[i],callFunction);
						}
					}
					// Element est une listElement
					else if(element instanceof listElement){
						element[action](callFunction);
					}
					// Jquery element
					else if(element instanceof jQuery){
						var myElement = element.data("data")
						if(myElement instanceof listElement) myElement[action](callFunction);
						else console.error("Cet élément jquery n'est pas associé à un élément de la liste.")
					}
					// Indice d'un element
					else if($.isNumeric(element)){
						if(element in curDatas)	curDatas[element][action](callFunction);
						else console.error("L'élément à la position " + element + " n'éxiste pas.");
					}
					// Element est null ou correspond à la référence à ALL alors on réalise l'action pour tous les élément
					else if(element === null || element === ALL){
						for(var i =curDatas.length-1; i>=0; i--){
							curDatas[i][action](callFunction);
						}
					}
					// Data d'un element => on vient comparer la data avec chaqu'une des data courante de la liste pour savoir sur laquel faire l'action
					else if(typeof element != "undefined"){
						for(var i = 0; i < curDatas.length; i++){
							var myFct = (typeof callFunction != "undefined")  ? callFunction : options.setValue;
							var dft = defaultSetValue(curDatas[i],element);
							if(typeof myFct != 'function') myFct = defaultSetValue;
							if(
									(typeof myFct == 'function' && myFct.call($container,curDatas[i],element)==true)
								||  (typeof myFct != 'function' && dft == true)
							){
								globalPublicFunction(action,curDatas[i],callFunction);
							}
						}
					}
					// Element n'est pas défini alors on récupère l'ensemble des élément associé a l'événement
					else{
						res = [];
						var capitalisedAction = "is"+action.charAt(0).toUpperCase() + action.slice(1);
						for(var i = 0; i< curDatas.length; i++){
							if(curDatas[i][capitalisedAction]()===true){
								var myFct = (typeof callFunction != "undefined")  ? callFunction : options.getValue;
								var dft = defaultGetValue(curDatas[i],element);
								var myData = (typeof myFct == 'function') ? myFct.call($container,curDatas[i],curDatas[i].data,dft) : dft;
								if(typeof myData != "undefined" ) res.push(myData);
							}
						}
					}
					
					return res;
				}

			// Méthodes Publiques
			// -----------------------------------------------------------------------------------
				/**
				 * \fct unselect
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Permet de tout déselectionenr
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeUnselect/afterUnselect)
				 * \brief Permet de déselectionner un élément
				 */
				function unselect(element,callFunction){
					return globalPublicFunction("unselect",element,callFunction);
				}

				/**
				 * \fct select
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Permet de selectioner l'ensemble des boutons présents
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeSelect/afterSelect)
				 * \brief Permet de sélectionner un élément
				 */
				function select(element,callFunction){
					var isMulti = (typeof options.multi == "function") ? options.multi.call($container) : options.multi;
					var mySelection = globalPublicFunction("select",element,callFunction);
					return isMulti===false || isMulti===0 || isMulti===1 ? mySelection[0] : mySelection;
				}

				/**
				 * \fct disable
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Permet de désactiver l'ensemble des boutons présents
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeDisable/afterDisable)
				 * \brief Permet de désactiver un élément
				 */
				function disable(element,callFunction){
					return globalPublicFunction("disable",element,callFunction);
				}

				/**
				 * \fct enable
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Permet de d'activer l'ensemble des boutons présents
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeEnable/afterEnable)
				 * \brief Permet de d'activer un élément
				 */
				function enable(element,callFunction){
					return globalPublicFunction("enable",element,callFunction);
				}

				/**
				 * \fct focus
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Retourne le focus de l'élément actuel
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeFocus/afterFocus)
				 * \brief Permet de mettre le focus sur un élément
				 */
				function focus(element,callFunction){
					if(typeof element == "undefined")	return globalPublicFunction("focus",element,callFunction)[0];
					else 								return globalPublicFunction("focus",element,callFunction);
				}

				/**
				 * \fct blur
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Permet de d'enlever le focus partout
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeBlur/afterBlur)
				 * \brief Permet de d'enlever le focus d'un élément
				 */
				function blur(element,callFunction){
					return globalPublicFunction("blur",element,callFunction);
				}

				/**
				 * \fct enableSort
				 * \brief Permet d'activer le tri manuel de la liste
				 */
				function enableSort(){
					if(typeof $.fn.sortable == "function")
					$buttonContainer.sortable("enable");
				}

				/**
				 * \fct disableSort
				 * \brief Permet de désactiver le tri manuel de la liste
				 */
				function disableSort(){
					if(typeof $.fn.sortable == "function")
					$buttonContainer.sortable("disable");
				}
			
			// Méthodes JQUERY
			// -----------------------------------------------------------------------------------
				/**
				 * \fct val
				 * \param element que l'on souhaite selectionné, si null ou non définie alors cela retourne les éléments selectionner
				 * \param type de valeur 'data'=> Set/get les data, 'select'=> Selectionne parmis les datas , 'unselect', 'disable', 'enable', 'focus', 'blur'
				 * \param function ... Permet de spécifier lorque l'on souhaite récupérer ou injecter des informations
				 * \brief Permet de mettre ou de récupérer les boutons sélectionnés
				 */
				function val(element,typeValue,cbFunction){
					if(typeof typeValue == 'undefined') typeValue = options.typeValue;
					if(typeof typeValue != "string") typeValue = "SELECT";
					
					if(typeValue.toUpperCase() == "DATA"){
						if(typeof element == "undefined"){
							return getElement(element,cbFunction);
						}else{
							if(options.keepValue==false) remove(null);
							return add(element);
						}
					}
					else if(typeValue.toUpperCase() == "SELECT"){
						if(options.keepValue==false) unselect(null);
						return select(element,cbFunction);
					}
					else if(typeValue.toUpperCase() == "UNSELECT"){
						if(options.keepValue==false) select(null);
						return unselect(element,cbFunction);
					}
					else if(typeValue.toUpperCase() == "FOCUS"){
						return focus(element,cbFunction);
					}
					else if(typeValue.toUpperCase() == "BLUR"){
						return blur(element,cbFunction);
					}

					if(typeof element != 'undefined'){
						unselect(null);
						select(element);
						return $container;
					}else{
						return select(undefined,cbFunction);						
					}
				}

				/**
				 * \fct datas
				 * \param Tableau de l'ensemble des éléments que l'on souhaite creer
				 * \param (utile si il y a un tableau de datas) Boolean : permet de conserver les datas précédentes
				 * \brief Permet de mettre ou de récupérer l'ensemble des datas souhaité 
				 */
				function datas(element, keep){
					if(typeof keep == "undefined") keep = false;
					if(typeof element != 'undefined'){
						if(keep!==true)remove(null);
						add(element);
						return $container;
					}else{
						if(typeof keep == "function") 	return $.map(curDatas,keep);
						else							return curDatas;
					}
				}

			// Ajout/Suppression de boutons
			// -----------------------------------------------------------------------------------

				/**
				 * \fct add
				 * \param element ou tableau d'element que l'on souhaite creer
				 * \brief Permet d'ajouter des boutons à la liste
				 */
				function add(data) {
					// Si c'est un tableau de valeur alors on ajoute les boutons un par un
					if($.isArray(data)) {
						var $els = [];
						for(var i = 0; i < data.length; i++) {
							$els.push(add(data[i]));
						}
						return $els
					}else if(typeof data =="function"){
						return add(data());
					}
					return new listElement(data).$el;
				}

				/**
				 * \fct remove
				 * \param element:
				 *		- Tableau => ensemble d'élément à traiter
				 *		- listElement => Objet spécifique au plugin
				 *		- jQuery => objet du bouton
				 *		- Entier => Indice du bouton 
				 *		- data => des informations original qui seront comparer avec les boutons en cours
				 *		- indéfini => Permet de supprimer l'ensemble des boutons présents
				 * \param callFunction : boolean permettant d'appeler ou non les fonctions associés (beforeEnable/afterEnable)
				 * \brief Permet de supprimer un élément
				 */
				function remove(element,callFunction){
					if(typeof element == "undefined")	return getElement(element,callFunction)
					else								return globalPublicFunction("remove",element,callFunction);
				}


			// Class
			// -----------------------------------------------------------------------------------

				// listElement
					function listElement(data){
						var tmp = (typeof options.beforeRendering == "function") ? options.beforeRendering.call($container,this,data) : true;
						if(tmp === false) return; // On s'arrete la
						if(typeof tmp !== 'undefined' && tmp !== true) data = tmp; // Mise a jour des nouvelles datas

						// Attributs
							this.data = data;
							this.id = curDatas.length;

							this.disabled = typeof data[options.text.attr_disabled] !="undefined" ? data[options.text.attr_disabled] : options[options.text.attr_disabled] || false;
							this.focused = typeof data[options.text.attr_focused] !="undefined" ? data[options.text.attr_focused] : options[options.text.attr_focused] || false;
							this.selected = typeof data[options.text.attr_selected] !="undefined" ? data[options.text.attr_selected] : options[options.text.attr_selected] || false;
							this.removable = typeof data[options.text.attr_removable] !="undefined" ? data[options.text.attr_removable] : options[options.text.attr_removable] || false;
							this.indicator = typeof data[options.text.attr_indicator] !="undefined" ? data[options.text.attr_indicator] : options[options.text.attr_indicator] || false;

							this.$indicator = $("<div>").addClass("icon");
							this.$removeBtn = createRemoveBtn.call(this);
						
						// Suppression des datas inutiles
							delete this.data[options.text.attr_disabled];
							delete this.data[options.text.attr_focused];
							delete this.data[options.text.attr_selected];
							delete this.data[options.text.attr_removable];
							delete this.data[options.text.attr_indicator];


						// Ajout du label :
							this.label = $.isPlainObject(data) ? (options.text.attr_label in data ? data[options.text.attr_label] : $.map(data,function(dt,key){return dt}).join(" ")) : data;
							if(typeof this.label == "function") this.label = this.label(this,data);
							var tmp = options.createLabel.call($container,this,data);
							if(typeof tmp != 'undefined'){
								this.label = tmp;
							}

						// Creation						
							curDatas.push(this);
							
							this.$el = createButton.call(this);
							$buttonContainer.append(this.$el);
							
							if(typeof options.afterRendering == 'function') options.afterRendering.call($container, this, data);

							init.call(this);

						// Fonction privés
							/**
							 * \fct createButton
							 * \brief Méthode privé ! Permet de créer le bouton jquery associé à l'element
							 */
							function createButton(){
								
								var $newButton = $("<span>")
									.attr('tabindex','-1')
									.addClass("button")
									.data("data",this)
									.on("click", clickOnButton)
									.on("focus", function() {
										var myElement = $(this).data("data")
										$container.focus();
										if(myElement.focused !== true)myElement.focus();
									})
									.on("blur", function() {
										var myElement = $(this).data("data")
										if($(this).data("data").focused != false)$(this).data("data").blur();
									})
									.on("keydown", function(e){
										/*var myElement = $(this).data("data")
										if(e.keyCode==32 || e.keyCode==13){
											clickOnButton.call(this,e);
											e.stopPropagation();
											return false;
										}
										// Si on appui sur tab et que l'on n'autorise pas la navigation interne 
										// alors on met le focus sur le dernier element pour que l'action fasse passer a l'element suivant
										else if(options.tabNav==false && e.keyCode==9 && e.shiftKey==false){
											curDatas[curDatas.length-1].focus();
										}
										// Si on appui sur maj + tab et que l'on n'autorise pas la navigation interne 
										// alors on met le focus sur le premier element pour que l'action fasse passer a l'element précédent
										else if(options.tabNav==false && e.keyCode==9 && e.shiftKey==true){
											curDatas[0].focus();
										}

										// Si on appui sur haut ou gauche et qu'il y a ctrlKey et que l'on peut déplacer les élément
										// Alors on déplace l'élément avec celui de gauche
										else if(options.sortable && e.ctrlKey && (e.keyCode == 38 || e.keyCode == 37)){ 
											$(this).data("data").move(myElement.id-1);
											e.stopPropagation();
											return false;
										}
										// Si on appui sur bas ou droite et qu'il y a ctrlKey et que l'on peut déplacer les élément
										// Alors on déplace l'élément avec celui de droite
										else if(options.sortable && e.ctrlKey && (e.keyCode == 39 || e.keyCode == 40)){ 
											$(this).data("data").move(myElement.id+1);
											e.stopPropagation();
											return false;
										}
										// Si on appui sur haut ou gauche  et que l'on peut naviguer parmis les élément
										// Alors on déplace le focus vers l'element précédent
										else if(options.keyNav && (e.keyCode == 38 || e.keyCode == 37)){
											if( (myElement.id-1) >= 0 ) curDatas[myElement.id-1].focus();
											else 						curDatas[curDatas.length-1].focus();
											e.stopPropagation();
											return false;
										}
										// Si on appui sur bas ou droite  et que l'on peut naviguer parmis les élément
										// Alors on déplace le focus vers l'element suivant
										else if(options.keyNav && (e.keyCode == 39 || e.keyCode == 40)){
											if( (myElement.id+1) < curDatas.length ) curDatas[myElement.id+1].focus();
											else 										curDatas[0].focus();
											e.stopPropagation();
											return false;
										}
										// Si on appui sur supprimer et que l'on autorise la suppréssion alors on supprime l'element
										else if(options.removable && e.keyCode == 46){
											myElement.$removeBtn.click();
										}
										*/
									})
								// Ajout des valeurs
								var $input = $("<span>").append(this.label).appendTo($newButton);

								// Ajout de l'indicateur
									if(options.indicator===true){
										$newButton.prepend(this.$indicator);
									}

								// Ajout du bouton de suppression
									if(options.removable === true){
											$newButton.append(this.$removeBtn)
									}
								
								return $newButton;
							}

							/**
							 *
							 * \brief Permet de creer le bouton de suppression
							 */
							function createRemoveBtn(){
								return $("<div>")
								.addClass("removeButton "+ options.text.class_removeBtn)
								.append("<img src='"+options.imagesSrc+options.images.remove+"'>")
								.click(function(){
									if($(this).parent().data("data")){
										$(this).parent().data("data").remove();
										event.stopPropagation();
										return false;
									}
								});
							}

							/**
							 * \fct clickOnButton
							 * \brief Méthode privé ! Méthode appellée lorsque l'on appui sur le bouton
							 */
							function clickOnButton() {
								var e = event;
								var $tmpMyButton = $(this);
								var myElement = $(this).data("data");
								var thisIndex = myElement.id;

								// On met a jour le focus sur cet element
								$(this).focus();

								if(myElement.disabled == true){
									console.error("Le bouton est désactivé et ne peut être sélectionné.")
									return;	
								} 

								if(options.multi===0)return;

								var isMulti = (typeof options.multi == "function") ? options.multi.call($container) : options.multi;

								if(isMulti === true || isMulti == -1 ) {
									if(e.ctrlKey && options.ctrlKey) {
										myElement.toggleSelect();
									}
									else if(e.shiftKey && options.shiftKey && lastButtonIndex != -1) {
										var start = (thisIndex < lastButtonIndex) ? thisIndex : lastButtonIndex;
										var end = (thisIndex < lastButtonIndex) ? lastButtonIndex : thisIndex;
										for(var i = start; i <= end; i++) {
											if(curDatas[i].disabled == false) curDatas[i].select();
										}
									} 
									else {
										if(options.ctrlKey) unselect(null);
										myElement.toggleSelect();
									}
								} else if(isMulti === false || isMulti > 0) {
									var previousState = myElement.selected;
									unselect(null);
									if(options.ctrlKey){
										if(e.ctrlKey){
											if(previousState == false ) 	myElement.select();
											else 							myElement.unselect();
										}else{
											myElement.select();
										} 

									}	
									else{
										if(previousState == false) 	myElement.select();
										else 						myElement.unselect();
									}
									
								}

								lastButtonIndex = thisIndex;								
								e.stopPropagation();
							}

							/**
							 *
							 * Initialise les options lié (enable/disable, removable, focused, selected)
							 */
							function init(){
								if(this.disabled===false) 		this.enable(false);
								else if(this.disabled===true) 	this.disable(false);

								if(this.indicator===false) 		this.$indicator.detach();
								else if(this.indicator===true) 	this.$el.prepend(this.$indicator);

								if(this.removable===false) 		this.$removeBtn.detach();
								else if(this.removable===true) 	this.$el.append(this.$removeBtn);

								if(this.focused===true) 		this.focus(false);
								else if(this.focused===false) 	this.blur(false);

								if(this.selected===true) 		this.select();
								else if(this.selected===false) 	this.unselect(false);
							}
					}

					// Méthodes publiques
						listElement.prototype.val = function(){
							var myFct = (typeof callFunction != "undefined")  ? callFunction : options.getValue;
							if(typeof myFct != 'function') myFct = defaultGetValue;
							return myFct.call($container,this,this.data);
						}						

						listElement.prototype.remove = function(callFunction){
							if(typeof callFunction == "undefined") callFunction = true
							if(callFunction == false){
								for(var i = this.id+1; i<curDatas.length; i++){
									curDatas[i].id--;
								}
								curDatas.splice(this.id,1);
								this.$el.remove();
								if(this.id in curDatas)	curDatas[this.id].focus();
								else if(this.id-1 in curDatas && curDatas[this.id-1] instanceof listElement)	curDatas[this.id-1].focus();
								delete this;
								changeAddValue();
							}else{
								var tmp = (typeof options.beforeRemoving == "function") ? options.beforeRemoving.call($container,this,this.data) : true;
								if(tmp !== false){
									var datas = this.data;
									this.remove(false);
									if(typeof options.afterRemoving== "function")options.afterRemoving.call($container,this,datas);
									delete datas;
								}
							}
						}

						listElement.prototype.toggleSelect = function(callFunction){
							if(this.selected === true) 	this.unselect();
							else 						this.select();
						}

						listElement.prototype.isSelect = function(callFunction){
							return this.selected;
						}
						listElement.prototype.select = function(callFunction){
							if(typeof callFunction == "undefined") callFunction = true;
							if(callFunction === false){
								this.selected = true;
								this.$el.addClass("selected "+options.text.class_selectedElement)
							}else{
								var tmp = (typeof options.beforeSelect == "function") ? options.beforeSelect.call($container,this,this.$el,this.data) : true;
								if(tmp !== false){
									this.select(false);
									if(typeof options.afterSelect== "function")options.afterSelect.call($container,this,this.$el,this.data);
								}
							}
						}

						listElement.prototype.isUnselect = function(callFunction){
							return !this.selected;
						}
						listElement.prototype.unselect = function(callFunction){
							if(typeof callFunction == "undefined") callFunction = true;
							if(callFunction === false){
								this.selected = false;
								this.$el.removeClass("selected "+options.text.class_selectedElement)
							}else{
								var tmp = (typeof options.beforeUnselect == "function") ? options.beforeUnselect.call($container,this,this.$el,this.data) : true;
								if(tmp !== false){
									this.unselect(false);
									if(typeof options.afterUnselect== "function")options.afterUnselect.call($container,this,this.$el,this.data);
								}
							}
						}

						listElement.prototype.isEnable = function(callFunction){
							return !this.disabled;
						}
						listElement.prototype.enable = function(callFunction){
							if(typeof callFunction == "undefined") callFunction = true;
							if(callFunction === false){
								this.disabled = false;
								this.$el.removeClass("disabled "+options.text.class_disableElement)
							}else{
								var tmp = (typeof options.beforeEnable == "function") ? options.beforeEnable.call($container,this,this.$el,this.data) : true;
								if(tmp !== false){
									this.enable(false);
									if(typeof options.afterEnable== "function")options.afterEnable.call($container,this,this.$el,this.data);
								}
							}
						}

						listElement.prototype.isDisable = function(callFunction){
							return this.disabled;
						}
						listElement.prototype.disable = function(callFunction){
							if(typeof callFunction == "undefined") callFunction = true;
							if(callFunction === false){
								this.disabled = true;
								this.$el.addClass("disabled "+options.text.class_disableElement)
							}else{
								var tmp = (typeof options.beforeDisable == "function") ? options.beforeDisable.call($container,this,this.$el,this.data) : true;
								if(typeof options.beforeDisable == "function" && options.beforeDisable.call($container,this,this.$el,this.data) !== false){
									this.disable(false);
									if(typeof options.afterDisable== "function")options.afterDisable.call($container,this,this.$el,this.data);
								}
							}
						}

						listElement.prototype.isFocus = function(callFunction){
							return this.focused;
						}
						listElement.prototype.focus = function(callFunction){
							if(typeof callFunction !== "boolean") callFunction = true;

							if(callFunction === false){
								if(this.focused===false){
									this.focused = true;
									this.$el.addClass("focused " +options.text.class_focusElement);
									for(var i = 0; i<curDatas.length; i++){
										if(i != this.id){
											curDatas[i].blur()										
										}
									}
								}
							}else{
								var tmp = (typeof options.beforeFocus == "function") ? options.beforeFocus.call($container,this,this.$el,this.data) : true;
								if(tmp  !== false){
									this.focus(false);
									if(typeof options.afterFocus== "function")options.afterFocus.call($container,this,this.$el,this.data);
								}
							}
						}
						listElement.prototype.isBlur = function(callFunction){
							return !this.focused;
						}
						listElement.prototype.blur = function(callFunction){
							if(typeof callFunction == "undefined") callFunction = true;
							if(callFunction === false){
								this.focused = false;
								this.$el.removeClass("focused "+options.text.class_focusElement)
							}else{
								var tmp = (typeof options.beforeBlur == "function") ? options.beforeBlur.call($container,this,this.$el,this.data) : true;
								if(tmp !== false){
									this.blur(false);
									if(typeof options.afterBlur== "function")options.afterBlur.call($container,this,this.$el,this.data);
								}
							}
						}

						listElement.prototype.move = function(newIndex){
							if(newIndex<0) newIndex = 0;
							if(newIndex>curDatas.length-1) newIndex= curDatas.length-1;
							
							// Déplacement de l'objet jquery
								// Déplacement au début
								if(newIndex <= 0){
									$buttonContainer.prepend(this.$el);
								}
								// Déplacement à la fin
								else if(newIndex > curDatas.length-1){
									$buttonContainer.append(this.$el);
								}
								// Déplacement inférieur
								else if(newIndex<this.id){
									curDatas[newIndex].$el.before(this.$el)
								}
								// Déplacement supérieur
								else{
									curDatas[newIndex].$el.after(this.$el)
								}
							
							// Modification de l'ordonancement du tableau
								curDatas.splice(newIndex, 0, curDatas.splice(this.id, 1)[0]);
							
							// Mise à jour des index des éléments								
								var start = newIndex<this.id ? newIndex : this.id;
								var end = newIndex>this.id ? newIndex : this.id;
								for (var i=start ; i<=end; i++){
									if(i in curDatas)curDatas[i].id = i;
								}
								this.focus();
						}

	    }

})(jQuery);