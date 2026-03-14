# xUnit.net Testing Stack

## File Naming and Location

- Name test files `*Tests.cs` matching the class under test: `UserService.cs` → `UserServiceTests.cs`.
- Place unit tests in a separate project: `MyApp.Tests` alongside the `MyApp` source project.
- Place integration tests in `MyApp.IntegrationTests` for clear separation.
- Mirror the source project's folder structure within the test project.

## Test Structure

- Use `[Fact]` for tests with no parameters. Use `[Theory]` for data-driven tests.
- Name test methods clearly: `MethodName_Scenario_ExpectedResult` (e.g., `FindById_UserExists_ReturnsUser`).
- Follow the Arrange-Act-Assert pattern within each test.
- Keep one logical assertion per test. Multiple `Assert` calls are acceptable when verifying a single outcome.

```csharp
public class UserServiceTests
{
    [Fact]
    public async Task FindById_UserExists_ReturnsUser()
    {
        // Arrange
        var expected = new User { Id = 1, Name = "Test" };
        _mockRepo.Setup(r => r.FindByIdAsync(1)).ReturnsAsync(expected);
        // Act
        var result = await _sut.FindByIdAsync(1);
        // Assert
        Assert.Equal(expected.Name, result.Name);
    }
}
```

## Theory Data Sources

- Use `[InlineData]` for simple inline parameter sets.
- Use `[MemberData]` to reference a static property or method returning `IEnumerable<object[]>`.
- Use `[ClassData]` to reference a dedicated data class implementing `IEnumerable<object[]>`.
- Prefer `[InlineData]` for fewer than five cases; use `[MemberData]` or `[ClassData]` for larger datasets.

```csharp
[Theory]
[InlineData(2, 3, 5)]
[InlineData(-1, -2, -3)]
[InlineData(0, 0, 0)]
public void Add_ReturnsCorrectSum(int a, int b, int expected)
{
    var result = Calculator.Add(a, b);
    Assert.Equal(expected, result);
}
```

## Mocking with Moq

- Create mocks with `new Mock<IUserRepository>()`. Access the mock object via `.Object`.
- Use `.Setup()` to define return values and `.ReturnsAsync()` for async methods.
- Use `.Verify()` to assert that methods were called with expected arguments.
- Use `.Callback()` to capture arguments for complex assertions.
- Prefer strict mocks (`MockBehavior.Strict`) for critical dependencies to catch unexpected calls.

## Class Fixtures and Collection Fixtures

- Implement `IClassFixture<T>` for setup shared across tests in a single class.
- Use collection fixtures (`[Collection]` attribute and `ICollectionFixture<T>`) for setup shared across multiple test classes.
- Inject fixture instances via constructor parameters — xUnit resolves them automatically.
- Use fixtures for expensive resources: database connections, HTTP clients, service containers.

## Integration Tests with WebApplicationFactory

- Use `WebApplicationFactory<Program>` to create an in-memory test server.
- Override services with `WithWebHostBuilder` and `ConfigureTestServices`.
- Use `HttpClient` from the factory to make requests against the test server.

```csharp
public class UserApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public UserApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUser_ReturnsOk()
    {
        var response = await _client.GetAsync("/users/1");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
```

## Test Output and Logging

- Inject `ITestOutputHelper` via the test class constructor for diagnostic output.
- Use `_output.WriteLine()` instead of `Console.WriteLine()` — xUnit captures it per test.
- Redirect application logging to `ITestOutputHelper` in integration tests for visibility.

## Assertions

- Use `Assert.Equal` for value comparison and `Assert.Same` for reference equality.
- Use `Assert.Throws<T>` or `Assert.ThrowsAsync<T>` to verify exceptions.
- Use `Assert.Collection` to verify ordered collections element by element.
- Use `Assert.Contains`, `Assert.DoesNotContain` for collection membership checks.
- Prefer FluentAssertions (`result.Should().Be(expected)`) for more readable assertions when the team adopts it.
