library(shiny)

ui <- shinyUI(fluidPage(
  
  titlePanel("Old Faithful Geyser Data"),
  
  fluidRow(
    column(2,
           sliderInput("bins",
                       "Number of bins:",
                       min = 1,
                       max = 50,
                       value = 30),
           style="overflow-x: scroll; overflow-y: scroll"),
    column(8,
           plotOutput("distPlot")),
    column(2,
           textInput("test", "Test"),
           style="overflow-x: scroll; overflow-y: scroll")
  )
))

server <- shinyServer(function(input, output) {
  
  output$distPlot <- renderPlot({
    x    <- faithful[, 2] 
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
    hist(x, breaks = bins, col = 'darkgray', border = 'white')
  })
})

shinyApp(ui = ui, server = server)