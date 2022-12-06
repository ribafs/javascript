import React from 'react';

class App extends React.PureComponent {


    constructor(props) {
        super(props);
        this.min = 2;
        this.max = 20;
        this.operators = {
            0: {
                display: "+",
                calc: (a, b) => [a, b, a+b] 
            },
            1: {
                display: "-",
                calc: (a, b) => a > b ? [a, b, a-b] : [b, a, b-a]
            },
            2: {
                display: "*",
                calc: (a, b) => [a, b, a*b] 
            },
            3: {
                display: ":",
                calc: (a, b) => [a*b, b, a] 
            }
        }
        
        this.state = {
            a: this.random(this.min, this.max),
            b: this.random(this.min, this.max),
            operator: this.random(0, 3),
            result: '',
            points: 0,
            exercises: 0,
            stars: []
        }
    }

    solve = () => {
        const [,,c] = this.operators[this.state.operator].calc(this.state.a, this.state.b)
        
        let currentPoints = this.state.points;
        if (parseInt(this.state.result) === parseInt(c)) {
            currentPoints++;

            const x = this.random(10, 90);
            const y = this.random(5, 25);
            this.setState({
                stars: [...this.state.stars, [x, y]]
            });
        }

        this.setState({
            a: this.random(this.min, this.max),
            b: this.random(this.min, this.max),
            operator: this.random(0, 3),
            result: '',
            points: currentPoints,
            exercises: ++this.state.exercises
        });
    }

    random = (min, max) => {
        const minVal = Math.ceil(min);
        const maxVal = Math.floor(max);
        return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }

    enter = (event) => {
        const allowed = /^[0-9\b]{1,3}$/;
        if (event.target.value == '' || allowed.test(event.target.value)) {
            this.setState({ result: event.target.value });
         }
    }

    handleSubmit = (event) => {
        this.solve(event);
        event.preventDefault();
    }

    render() {
        const operator = this.operators[this.state.operator].display;
        const [a, b, c] = this.operators[this.state.operator].calc(this.state.a, this.state.b);

        const percent = (this.state.points*1.0/this.state.exercises)*100;
        const style = {
            background: `linear-gradient(to bottom, #BAFFDA ${percent}%, #5D7F6D 100%)`
        }
        
        const stars = this.state.stars.map(element => {
            return (
                <span className='star'>⭐️</span>
            );
        });
        return (
            <div id='container' style={style}>
                <div className='stars'>
                    {stars}
                </div>
                <div id='main'>
                    <form onSubmit={this.handleSubmit}>
                        <div className='solve'>
                            <div className="value">{a}</div>
                            <div className="operator">{operator}</div>
                            <div className="value">{b}</div>
                            <div className="operator">=</div>
                            <input type='text' value={this.state.result} onChange={this.enter}/>
                        </div>
                        <div className='hide'>
                            <input type='submit' value='Enter'></input>
                        </div>
                        <div className='hide'>
                            <div className="points">{this.state.points}</div>
                            <div className="points">{c}</div>
                            <div className="points">{this.state.exercises}, {percent}</div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export { App };