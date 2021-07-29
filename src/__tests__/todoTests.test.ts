import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";
const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

// I really liked using the xpath locators here vs the other types
class TodoPage {
  todoInput: By = By.xpath("//*[@class='new-todo']");
  todos: By = By.xpath("//*[@class='todo']");
  todoLabel: By = By.xpath("//label");
  todoComplete: By = By.xpath("//input[@class='toggle']");
  clearCompletedButton: By = By.xpath("//button[@class='clear-completed']");
  todoCount: By = By.xpath("//*[@class='todo-count']");
  star: By = By.xpath("//*[@class='star']");
  starred: By = By.xpath("//*[@class='starred']");
  activetodo: By = By.xpath("//*[text() = 'Active']")
  driver: WebDriver;

  //I double checked the solution to make this series of tests work.
  url: string = "https://devmountain.github.io/qa_todos/";

  constructor(driver: WebDriver) {
    this.driver = driver;
  }
}
const tp = new TodoPage(driver);
  
describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(tp.url);
  });
  afterAll(async () => {
    await driver.quit();
  });

  it("It can add a todo", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    await driver.findElement(tp.todoInput).sendKeys("Test\n");
  });
  it("It can remove a todo", async () => {
    let myTodos = await driver.findElements(tp.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test";
      })[0]
      .findElement(tp.todoComplete)
      .click();
    await (await driver.findElement(tp.clearCompletedButton)).click();
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Test";
    });
    expect(myTodo.length).toEqual(0);
  });

  it("It can star a todo", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    let startingStars = await (await driver.findElements(tp.starred)).length;
  
    await driver.findElement(tp.todoInput).sendKeys("Test\n");
    await (await driver.findElements(tp.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test";
      })[0]
      .findElement(tp.star)
      .click();
    let endingStars = await (await driver.findElements(tp.starred)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
  });
  it("It will show only active todos when active is selected", async () => {
    let myTodos = await driver.findElements(tp.todos);
    await driver.findElement(tp.todoInput).sendKeys("Test\n");
    await (await driver.findElements(tp.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test";
      })[0]
      .findElement(tp.todoComplete)
      .click();
    await (await driver.findElement(tp.activetodo)).click();
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Test";
    });
    expect(myTodo.length).toEqual(1);
    
});
});
