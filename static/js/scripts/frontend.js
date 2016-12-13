$(document).ready ( function() {
	$('#btnSearch').click( function () {
		var choices = {
			color: $('#colors :selected').val(),
			material: $('#materials :selected').val()
		}
		// send ajax request to do the search
		$.ajax( {
			type: 'get',
			url: '/showproducts',
			data: choices,
			success: function ( data ) {
				$(".productData").empty()
				for (var i = data.length - 1; i >= 0; i--) {
					// $('#aftersearch').fadeIn("slow")
					console.log( data[i].id ) 
					$("<div class='col-sm-4 col-lg-4 col-md-4 productData'> \
						<div class='thumbnail'> \
							<a href='/product?id=" + data[i].id + "'><img src='http://placehold.it/320x150', alt=''></img></a> \
							<caption> \
								<h4 class='pull-right'>" + data[i].price + "</h4> \
								<h4><a>" + data[i].name + "</a></h4> \
								<p><See more></p> \
							</caption> \
						</div> \
					</div>").hide().fadeIn( 500 ).insertAfter( '#aftersearch' )
				}
			}
		})
	})
})