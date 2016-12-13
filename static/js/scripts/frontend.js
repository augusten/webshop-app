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
				// for (var i = data.length; i > 0; i--) {
				// 	console.log(data[i-1])
				// 	// need to upgrade to show user name, not number
				// 	$( "<p>" + data[i-1].comText + "</p>" + "<p><i> - Comment by user #" + data[i-1].userId + "</p></i>" ).insertAfter( '#comment-list' )
				// }
				console.log( data )
			}
		})
	})
})