# ReactJS

Using the library with ReactJS is very simple. Just call Javascript in the render :

```js
class Example extends React.Component {
  render() {
    return (
      <div>
        <h1>{'hello'.t()}</h1>
      </div>
    );
  }
}

Languages.init(['en_EN', 'fr_FR'], './languages/', () => {
  ReactDOM.render(
    <Example />,
    document.getElementById('example')
  );
})
```

Example 1 : https://embed.plnkr.co/VXMrtgm5raGqSAmQ8Fnq/
Example 2 (with select box) : https://embed.plnkr.co/Fwh0UOb4aBLt3e8xppaE/
