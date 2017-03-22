<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>SORT</title>
</head>
<body>
    <p>请输入你要排序的数据（以空格分开）：<br /></p>
    <form action="sort.php" method="POST">
        <input type="text" name="arr" id="arr" />
        <input type="submit" value="点击确定" name="submit" />
    </form>
    <br />
    <?php
        if (isset($_POST['submit'])) {
            $arr=explode(' ', $_POST['arr']);
            mp_sort($arr);
            echo "下面是冒泡排序法（从大到小）：<br />";
            print_r($arr);
            echo"<br />下面是选择排序法（从小到大）：<br />";
            xz_sord($arr);
            print_r($arr);

        }else{
            echo "还没有建立数据！";
        }
        function mp_sort(&$sort){
            $m=0;
            for ($i=0; $i <count($sort)-1 ; $i++) {
                for ($j=0; $j<count($sort)-1-$i ; $j++) {
                    if ($sort[$j]<$sort[$j+1]) {
                        $m=$sort[$j];
                        $sort[$j]=$sort[$j+1];
                        $sort[$j+1]=$m;
                    }
                }
            }
        }
        function xz_sord(&$sort){
            $m=0;
            $c=0;//代表最小的角标
            $k=0;
            for ($i=0; $i <count($sort) ; $i++) {
                for ($j=$i; $j <count($sort) ; $j++) {
                    if ($sort[$j]<$sort[$c]) {
                        $c=$j;
                        $k=1;
                    }
                }
                if ($k==1) {
                    $m=$sort[$i];
                    $sort[$i]=$sort[$c];
                    $sort[$c]=$m;
                    $k=0;
                }
            }
        }
     ?>
</body>
</html>