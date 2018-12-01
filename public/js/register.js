var uname = document.getElementById('name');
var checkUname = document.getElementById('checkUname');
var flag1 = false; //用户名不合法表示不可提交
var flag2 = false; //密码不正确表示不可提交
//验证用户名		
uname.onblur = function() {
    var userValue = uname.value;
    if (userValue == "") {
        checkUname.innerHTML = "用户名不能为空";
        checkUname.style.color = "red";
        flag1 = false;
    } else if (!(/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/.test(userValue))) {
        checkUname.innerHTML = "不能以数字开头";
        checkUname.style.color = "red";
        flag1 = false;
    } else {
        checkUname.innerHTML = "可用";
        checkUname.style.color = "limegreen";
        flag1 = true;
    }
}

var upwd = document.getElementById('pwd');
var checkPwd = document.getElementById('checkPwd');
//验证密码
upwd.onblur = function() {
    var userupwd = upwd.value;
    if (userupwd == "") {
        checkPwd.innerHTML = "密码不能为空";
        checkPwd.style.color = "red";
        flag2 = false;
    } else if (userupwd.length < 6) {
        checkPwd.innerHTML = "密码至少6位";
        checkPwd.style.color = "red";
        flag2 = false;
    } else {
        checkPwd.innerHTML = "可用";
        checkPwd.style.color = "limegreen";
        flag2 = true;
    }
}
form.onsubmit = function() {
    return flag1 && flag2 && flag3;
}