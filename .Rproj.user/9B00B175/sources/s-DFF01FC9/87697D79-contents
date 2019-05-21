#　server.R

library(shiny)
library(datasets)


shinyServer(function(input, output) {
  
  
  #1. 僅在輸入有變化時調用
  #2. 計算和結果由所有callers共享（只執行一次）
  #3. 當輸入改變並重新執行時，新結果與之前的結果進行比較; 如果這兩個是相同的，便會通知callers
  
  datasetInput <- reactive({
    switch(input$dataset,
           "rock" = rock,
           "pressure" = pressure,
           "cars" = cars)
  })
  
  #output$caption 是根據reactive function計算的
  #input$caption 則是用戶更改'標題'時：
  #1. 自動調用此function以重新計算輸出
  #2. 新標題被推回瀏覽器重新顯示
  
  
  output$caption <- renderText({
    input$caption
  })
  
  # output$summary 取決於輸入的datasetInput reactive function, 
  # (i.e. 每當input$dataset 改變時， summary會變動)
  
  output$summary <- renderPrint({
    dataset <- datasetInput()
    summary(dataset)
  })
  
  # output$view 取決於輸入的 databaseInput reactive expression和 input$obs
  
  output$view <- renderTable({
    head(datasetInput(), n = input$obs)
  })
})