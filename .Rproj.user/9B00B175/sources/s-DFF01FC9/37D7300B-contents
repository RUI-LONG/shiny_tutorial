library(shiny)

ui <- shinyUI(pageWithSidebar(
  
  # 標題(最明顯的那種)
  headerPanel("Hello Shiny!"),
  
  # 注意obs, displot對應關係
  # sidebarPanel 指的是在頁面側邊放入你要做的事 
  
  # 這邊的範例是一個滑動的霸，讓人可以選觀測值的輸入個數
  
  sidebarPanel(
    sliderInput("obs", 
                "Number of observations:", 
                min = 0, 
                max = 1000, 
                value = 500)
  ),
  
  
  # 在主畫面 顯示產生的normal分布
  mainPanel(
    plotOutput("distPlot")
  )
))

server <- shinyServer(function(input, output) {
  
  
  output$distPlot <- renderPlot({
    
    # 產生normal的分布
    dist <- rnorm(input$obs)
    hist(dist)
  })
})



shinyApp( ui = ui, server = server)

