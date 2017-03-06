angular.module('PIR').config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#005252', '#FF8A80'],
    responsive: true
  });
  ChartJsProvider.setOptions('tooltips', {
    titleFontFamily: 'koodak',
    position: 'nearest',
    titleMarginBottom: 15,
    bodyFontFamily: 'koodak',
    footerFontFamily: 'koodak'
  });
  ChartJsProvider.setOptions('layout', {
    padding: 10
  });
  ChartJsProvider.setOptions('line', {
    showLines: true
  });
  ChartJsProvider.setOptions('elements', {
    line: {
      tension: 0.1
    }
  });
}]);