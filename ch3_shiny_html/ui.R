# ui.R

library(shiny)

shinyUI(pageWithSidebar(
  
  # 標題(最明顯的那種)
  headerPanel("Reactivity"),
  
  # textInput　輸入文字用
  # selectInput　選取方格
  # numericInput　輸入數值
  
  # 以上這些皆可以即時變換要呈現的主畫面
  
  sidebarPanel(
    textInput("caption", "Caption:", "Data Summary"),
    
    selectInput("dataset", "Choose a dataset:", 
                choices = c("rock", "pressure", "cars")),
    
    numericInput("obs", "Number of observations to view:", 10)
  ),
  
  
  # 主畫面包含輸入變換的title、 data的摘要、data實際樣貌
  mainPanel(
    h3(textOutput("caption")), 
    
    verbatimTextOutput("summary"), 
    
    tableOutput("view"),
    
    includeHTML("../ch3_shiny_html/www/index.html")
  )
))