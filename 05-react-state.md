# State
Состояние - некая переменная внутри компонента, которая изменяется во время жизни приложения. Необходима для добавления динамики приложению.
Например, состояние инпута (значение инпута которое изменяется при вводе пользователя).

Состояние есть у классовых компонентов

```
typescript
import { Component, ReactNode, ChangeEvent } from 'react';

// типизация пропсов и стейта
class Input extends Component<{}, { value: string }> {
  // храним состояние в свойстве state
  state = { value: '' }

  changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // метод this.setState приводит к перерендеру компонента после изменения состояния
    this.setState({ value: e.target.value })
  }

  render(): ReactNode {
    return <input value={ this.state.value } onChange={ this.changeHandler } />
  }
}
```

Если значение стейта опирается на предыдущее, то обязательно используем синтаксис коллбека

```
typescript
class Counter extends Component<{}, { value: number }> {
  state = { value: 0 }

  increaseHandler = () => {
    // значение состояния высчитывается на основе предыдущего, поэтому используем синтаксис коллбека
    this.setState((prevState) => ({ value: prevState.value + 1 }))
  }

  decreaseHandler = () => {
    // значение состояния высчитывается на основе предыдущего, поэтому используем синтаксис коллбека
    this.setState((prevState) => ({ value: prevState.value - 1 }))
  }

  resetHandler = () => {
    // значение состояния задается константой, поэтому обычный объект
    this.setState({ value: 0 })
  }

  render(): ReactNode {
    return (
      <div>
        counter: { this.state.value }
        <button onClick={ this.increaseHandler }>Increase</button>
        <button onClick={ this.decreaseHandler }>Decrease</button>
        <button onClick={ this.resetHandler }>Reset</button>
      </div>
    )
  }
}
```

Можно обновлять как весь стейт за раз, так и частично
```
class App extends Component<{}, { value: number; inputValue: string }> {
  state = { counterValue: 0, inputValue: '' }

  updateAll = (counterValue: number, inputValue: string) => {
    this.setState({ counterValue, inputValue })
  }

  updateCounter = (counterValue) => {
    // передавая лишь одно поле, остальные останутся неизменными
    this.setState({ counterValue })
  }
}

```

## Управляемые и неуправляемые компоненты

class Input extends Component<{}, { value: string }> {
  state = { value: '' }

  changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value })
  }

  render(): ReactNode {
    return (
      <div>
        {/* это управляемый инпут, т.к. мы передаем ему значение, опирающееся на стейт нашего компонента */}
        <input value={ this.state.value } onChange={ this.changeHandler } />
        {/* это неуправляемый инпут, т.к. он имеет свой внутренний стейт */}
        <input />
      </div>
    );
  }
}

# Lifecycle
[lifecycle resume](https://github.com/fetchMachine/tms-js-pro/blob/main/33-lifecycle/lifecycle_resume.md)
