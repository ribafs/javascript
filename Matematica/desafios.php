<?php
	// Retorna se número é primo (true - 1) ou não (false)
    function is_prime($number)
    {
        // 1 is not prime
        if ( $number == 1 ) {
            return false;
        }
        // 2 is the only even prime number
        if ( $number == 2 ) {
            return true;
        }
        // square root algorithm speeds up testing of bigger prime numbers
        $x = sqrt($number);
        $x = floor($x);
        for ( $i = 2 ; $i <= $x ; ++$i ) {
            if ( $number % $i == 0 ) {
                break;
            }
        }
     
        if( $x == $i-1 ) {
            return true;
        } else {
            return false;
        }
    }
print is_prime(4);exit;
    $start = 0;
    $end =   1000000;
    for($i = $start; $i <= $end; $i++)
    {
        if(is_prime($i))
        {
            echo '<strong>'.$i.'</strong>, ';
        }
    }
//https://www.hashbangcode.com/article/php-function-detect-prime-number

// Outra

// PHP code to check wether a number is prime or Not 
// function to check the number is Prime or Not 
function primeCheck($number){ 
    if ($number == 1) 
    return 0; 
    for ($i = 2; $i <= $number/2; $i++){ 
        if ($number % $i == 0) 
            return 0; 
    } 
    return 1; 
} 
  
// Driver Code 
$number = 30; 
$flag = primeCheck($number); 
if ($flag == 1) 
    echo "Prime"; 
else
    echo "Not Prime"
//https://www.geeksforgeeks.org/php-check-number-prime/
