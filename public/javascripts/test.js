$(document).ready(function() {
  $("#slider").slider({
    animate: true,
    value:1,
    min: 0,
    max: 30,
    step: 1,
    slide: function(event, ui) {
      update(1,ui.value); //changed
    }
  });


  //Added, set initial value.
  $("#rps").val(0);
  $("#numServer").val($numberServer);
  $("#rps-label").text(0);
  $("#numServer-label").text($numberServer);

  update();

  $('#sendRequest').on('click', () => {
    $.ajax({
      url: 'http://localhost:',
      method: 'GET',

      success: function(){

      }
    });
  });
});
var $numberServer = 500;
//changed. now with parameter
function update(slider,val) {
  //changed. Now, directly take value from ui.value. if not set (initial, will use current value.)
  var $rps = slider == 1?val:$("#rps").val();

  $total = ($rps * $numberServer);
  $( "#rps" ).val($rps);
  $( "#rps-label" ).text($rps);
  $( "#numServer-label" ).text($numberServer);
  $( "#total" ).val($total);
  $( "#total-label" ).text($total);

  $('#slider span').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+$rps+' <span class="glyphicon glyphicon-chevron-right"></span></label>');
}
