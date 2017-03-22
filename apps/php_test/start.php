<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>金字塔</title>
    <script type="text/javascript">
        function show(){
            var if_is=document.getElementById('if_is').value;
            if(if_is==''||if_is>100){
                alert('请填写正确的金字塔的层数！(不得大于100小于1)');
                return false;
            }else{
                return true;
            }
        }
    </script>
</head>
<body>
    <form action="start.php" method="POSt" onsubmit="return show();">
        <label for="if_is">请输入你要建立的金字塔的层数：</label>
        <input type="text" name="if_is" id="if_is" />
        <br />
        靠左：<input type="radio" name="who" id="who" value="l" checked />
        靠中：<input type="radio" name="who" id="who" value="m" />
        <br />
        <input type="submit" name="submit" value="提交" />
        <br />
    </form>
</body>
</html>
<?php
    if (isset($_POST['submit'])) {
        $who=$_POST['who'];
        $if_is=$_POST['if_is'];
        if ($who=='l') {
            //输出靠左的金字塔
            for ($i=1; $i <=$if_is; $i++) {
                for ($j=1; $j <=$i ; $j++) {
                    echo "*";
                }
                echo "<br />";
            }
        }
        if($who=='m'){
            //输出靠右的金字塔
            for ($i=1; $i <=$if_is; $i++) {
                $space=$if_is-$i;//空格数量
                $star=1+($i-1)*2;//星号的数量
                //输出空格
                for ($k=0; $k <$space ; $k++) {
                    echo "&nbsp;";
                }
                //输出星号
                for ($k=0; $k <$star; $k++) {
                    echo "*";
                }
                //输出换行符
                echo "<br />";
                continue;
            }
        }
    }else{
        echo "还没有建立数据！";
    }
?>