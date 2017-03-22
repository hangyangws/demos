<?php
    function number($i){
        if($i<5){
           return 1;
        }else{
            $sum=0;
            $sum+=number($i-1)+number($i-5);
            return $sum;
        }
    }
    for ($i=1; $i <=20 ; $i++) {
        echo "第".$i."年是".number($i)."头<br />";
    }

?>