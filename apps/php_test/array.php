<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Array</title>
</head>

<body>
    <p>请输入你要计算平局数的几个数字（用空格分开）</p>
    <form action="array.php" method="POST">
        <input type="text" name="array" id="array" />
        <input type="submit" value="开始计算" name="submit" />
    </form>
    <?php
        if(isset($_POST['submit'])){
            $arr1=$_POST['array'];
            $arr2=explode(' ', $arr1);
            $sum=0;
            for ($i=0; $i <count($arr2) ; $i++) {
                $sum+=$arr2[$i];
            }
            $sum=$sum/count($arr2);
            echo "平局数是：".$sum;
        }else{
            echo "还没有建立数据！";
        }
     ?>
</body>

</html>
</body>

</html>
