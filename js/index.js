$(document).ready(function(){
	
	initLists();


	// Check for data if it already exists and populate
	

	function initLists(){
		var initialLists = localStorage.getItem('ixigo');
		initialLists = JSON.parse(initialLists)
		if(initialLists && initialLists.length > 0){
			populateLists(initialLists);
		}
		else{
			$('#lists').html('<h3> No Lists Added </h3>')
		}
	}


	// Retreive data from localstorage

	function getLocalStorage(){
		var result = localStorage.getItem('ixigo')
		return result;
	}


	// Update Data in localstorage

	function setLocalStorage(data, callback){
		localStorage.setItem('ixigo', data)

		callback(getLocalStorage())
	}



	// Update Lists

	function populateLists(data){
		var str = ''
		for (var i = 0; i < data.length; i++) {
			var listId = data[i].name.replace(/\s+/g, '-').toLowerCase();
			str += '<div class="col-sm-3 list" id="'+listId+'">'+
						'<div class="row"><h3 class="col-sm-8">'+data[i].name+'</h3>'+
							'<div class="pull-right"><span data-listName="'+data[i].name+'" data-listId="'+listId+'" class="edit-list"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>&nbsp;<span data-listId="'+listId+'" class="delete-list"><i class="fa fa-times" aria-hidden="true"></i></span>'+
							'</div>'+
						'</div>'+
						'<div class="card-detail"></div>'

			if(data[i].cards){
				for (var j = 0; j < data[i].cards.length; j++) {
					var cardId = data[i].cards[j].username.replace(/\s+/g, '-').toLowerCase();

					str += '<div class="cards" id="'+cardId+'">'+
								'<div class="pull-right"><span data-listName="'+data[i].name+'" data-listId="'+listId+'" data-cardId="'+cardId+'" data-cardName="'+data[i].cards[j].username+'" data-cardStatus="'+data[i].cards[j].status+'" data-cardDescription="'+data[i].cards[j].description+'" class="edit-card"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>&nbsp;<span data-listId="'+listId+'" data-cardId="'+cardId+'" class="delete-card"><i class="fa fa-times" aria-hidden="true"></i></span>'+
								'</div>'+
								'<div><label>username:</label>'+data[i].cards[j].username+'</div>'+
								'<div><label>status:</label>'+data[i].cards[j].status+'</div>'+
								'<div><label>description:</label>'+data[i].cards[j].description+'</div>'+
							'</div>'
					
				}

			}
				str += '<div><button class="addCard btn btn-warning" data-id="'+listId+'">Add card</button></div>'+
						'</div>';
		}

		$('#lists').html(str)

	}



	// Update Lists after editing

	function updateLists(id, name){
		var data = getLocalStorage();
		data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			if(id === data[i].id){
				data[i].name = name;
				data[i].id = name.replace(/\s+/g, '-').toLowerCase();
			}
		}

		data = JSON.stringify(data)
		setLocalStorage(data, function(result){
			result = JSON.parse(result);
			populateLists(result)
		})
	}



	// Update Cards after editing

	function updateCards(card, listId, cardId){
		var data = getLocalStorage();
		data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			if(listId === data[i].id){
				for (var j = 0; j < data[i].cards.length; j++) {
					if(cardId === data[i].cards[j].id){
						data[i].cards[j] = card
						break
					}
				}
				break
			}
		}

		data = JSON.stringify(data)
		setLocalStorage(data, function(result){
			result = JSON.parse(result);
			populateLists(result)
		})
	}


	// Delete List

	function removeList(id){
		data = getLocalStorage();
		data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			if(id === data[i].id){
				data.splice(i,1)
			}
		}

		data = JSON.stringify(data);
		setLocalStorage(data, function(result){
			result = JSON.parse(result)
			populateLists(result)
		})
	}



	// Delete Cards

	function removeCard(listId, cardId){
		data = getLocalStorage();
		data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			if(listId === data[i].id){
				for (var j = 0; j < data[i].cards.length; j++) {
					if(cardId === data[i].cards[j].id){
						data[i].cards.splice(j,1)
						break
					}
				}
				break
			}
		}

		data = JSON.stringify(data);
		setLocalStorage(data, function(result){
			result = JSON.parse(result)
			populateLists(result)
		})
	}




	$(document).on('click', '.delete-list', function(){
		var list = $(this).attr('data-listId');
		removeList(list);
	})

	$(document).on('click', '.delete-card', function(){
		var list = $(this).attr('data-listId');
		var card = $(this).attr('data-cardId');
		removeCard(list, card);
	})

	$(document).on('click', '.edit-list', function(){
		var list = $(this).attr('data-listId');
		var listName = $(this).attr('data-listName');
		$('#listName').val(listName)
		$('#listModal').modal('show');
		$('#listModal .modal-footer').append('<button type="button" data-listId="'+list+'" class="btn btn-primary" id="listEditBtn">Save changes</button>');
		$('#listNameBtn').remove();
	})


	$(document).on('click', '.edit-card', function(){
		var list = $(this).attr('data-listId');
		var card = $(this).attr('data-cardId');
		var listName = $(this).attr('data-listName');
		var cardName = $(this).attr('data-cardName');
		var cardStatus = $(this).attr('data-cardStatus');
		var cardDescription = $(this).attr('data-cardDescription');
		$('#username').val(cardName)
		$('#status').val(cardStatus)
		$('#description').val(cardDescription)
		$('#cardModal').modal('show');
		$('#cardModal .modal-footer').append('<button data-listId="'+list+'" data-cardId="'+card+'" type="button" class="btn btn-primary" id="cardEditBtn">Save changes</button>');
		$('#cardBtn').remove();
	})

	
	$(document).on('click', '#cardEditBtn',function(){
		var username = $('#username').val();
		var status = $('#status').val();
		var description = $('#description').val();
		var card = {
			username: username,
			description: description,
			status: status,
			id: username.replace(/\s+/g, '-').toLowerCase()
		}
		var listId = $('#cardEditBtn').attr('data-listId');
		var cardId = $('#cardEditBtn').attr('data-cardId');
		updateCards(card, listId, cardId)
		$('#cardModal .modal-footer').append('<button type="button" class="btn btn-primary" id="cardBtn">Save changes</button>');
		$('#cardEditBtn').remove();
		$('#cardModal').modal('hide');
		$('#username').val('');
		$('#status').val('');
		$('#description').val('');
	})


	$(document).on('click', '#listEditBtn',function(){
		var list = $('#listName').val();
		var id = $('#listEditBtn').attr('data-listId');
		updateLists(id ,list)
		$('#listModal .modal-footer').append('<button type="button" class="btn btn-primary" id="listNameBtn">Save changes</button>');
		$('#listEditBtn').remove();
		$('#listName').val('')
		$('#listModal').modal('hide');
	})

	$(document).on('click', '#listNameBtn', function(){
		var listName = $('#listName').val();
		var checkLists = getLocalStorage();
		var newList = {};
		newList['name'] = listName;
		newList['id'] = listName.replace(/\s+/g, '-').toLowerCase();
		if(!checkLists){
			var	result = [];
		}
		else{
			result = JSON.parse(checkLists)
		}

		result.push(newList)
		result = JSON.stringify(result)
		localStorage.setItem('ixigo', result)
		setLocalStorage(result, function(data){
			data = JSON.parse(data)
			populateLists(data)
		})
		$('#listName').val("")
		$('#listModal').modal('hide')
	});


	$(document).on('click', '.addCard', function(){
		var cardList = $(this).attr('data-id');
		$('#cardModal').modal('show')
		$('#cardBtn').attr('data-listId', cardList)

	})

	$(document).on('click', '#cardBtn', function(){
		var cardList = $(this).attr('data-listId')
		var description = $('#description').val();
		var status = $('#status').val();
		var username = $('#username').val();
		var cardDetail = {
			status: status,
			username: username,
			description: description,
			id: username.replace(/\s+/g, '-').toLowerCase()
		}


		var checkLists = getLocalStorage();
		checkLists = JSON.parse(checkLists);
		for (var i = 0; i < checkLists.length; i++) {
			
			if(cardList === checkLists[i].id){
				if(!checkLists[i].cards){
					var cardArr = []
				}
				else{
					cardArr = checkLists[i].cards
				}
				cardArr.push(cardDetail);
				checkLists[i]['cards'] = cardArr;
				break;
			}
		}

		checkLists = JSON.stringify(checkLists);
		setLocalStorage(checkLists, function(data){
			data = JSON.parse(data)
			populateLists(data)
		})
		$('#username').val("")
		$('#status').val("")
		$('#description').val("")
		$('#cardModal').modal('hide');

	})




	// Move Lists using Jquery UI

	$( ".list-container" ).sortable({
	  connectWith: ".list-container",
	  handle: ".cards"
	});
})