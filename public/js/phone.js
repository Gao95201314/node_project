//手机新增
$('.addphone').click(function() {
    $(".filter").css({ 'display': 'block' });
})

$('#sure').click(function() {
    $('.filter').css({ 'display': 'none' });
})
$('#no').click(function() {
    $('.filter').css({ 'display': 'none' });
})

//手机修改
$('.a1').each(function(index, item) {
    $(this).click(function() {
        $('.update').css({ 'display': 'block' });
    })
})

$('.sure1').click(function() {
    $('.update').css({ 'display': 'none' });
})
$('.no1').click(function() {
    $('.update').css({ 'display': 'none' });
})