# javascript-calculator

## Examples from simple sum to scientific calculator

## Only sum and simple code
calc_sum.html

### Example shared in Facebook group HTML, CSS and JS
```
<script>
const add = (...nums) => alert(nums.reduce((a, b) => +a + +b));
add(...Array.from({length:2}, _ => prompt('Please enter a number...')));
//Although if you only see it as 1 input for the entire equation, it could be even more direct.
alert(eval(prompt('Please enter equation').replace(/[^%+-/*/(/)\d+]/g, '')));
</script>
```
Thank you Shawn John Genlloud

## Four operations and simple code
calc_js.htm

## Four operations and simplel and only one function and form
calc_js2.html

## With keyboard and simple code
calc_js3.html

## Scientific calculator
calc_cient.html

## References

https://stackoverflow.com/questions/60346902/i-cant-do-a-simple-calculator-with-javascript

https://medium.com/@singhamritpal49/creating-simple-addition-calculator-with-javascript-563ede3527e2

https://www.codigofonte.com.br/codigos/calculadora-em-html-e-javascript

https://comodesenvolver.com.br/como-criar-uma-calculadora-cientifica-usando-html-javascript-e-css/

http://www.devin.com.br/calculadoras-javascript/

## License

MIT

