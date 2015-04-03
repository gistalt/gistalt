$('.js-hide').hide()
var Gistalt = Object.create( new ActiveStorage("Gistalt") )
var cm = CodeMirror.fromTextArea(document.getElementById('content'), {
    mode: 'gfm',
    lineWrapping: true,
    theme: "default"
});
cm.on("change", function( cm ){
  $("[data-saved]").attr('data-saved', cm.getValue() == g.content )
})
var textarea = document.querySelector('.CodeMirror');
var autosize = function autosize(){
  var el = textarea;
  setTimeout(function(){
    el.style.cssText = 'padding:0';
    el.style.cssText = 'height:' + parseInt(el.scrollHeight + 35 )+ 'px';
  },0);
}
var g = Gistalt.findBy({
  gist_id: $("[name='id']").val()
})
if( !g ){
  Gistalt.create({
    gist_id: $("[name='id']").val(),
    content: $('#content').html()
  })
}else{
  g.content = $('#content').html()
}

autosize()
textarea.addEventListener('keydown', autosize);

$('[data-submit]').on('click', function( event ){
  $(this).attr('data-saved', true )
  event.preventDefault()
  var $submittee = $($(this).data('submit'))
  cm.save() // update textarea
  g.content = cm.getValue()
  g.save()
  $.ajax({
    url: $submittee.attr('action') + '/json',
    method: $submittee.attr('method'),
    data: $submittee.serialize(),
    success: function( response ){
      $('.js-updated-at').html( response.updated_at )
    }
  })
})
