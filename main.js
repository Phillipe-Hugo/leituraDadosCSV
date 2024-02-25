function loadCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function(event) {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          createChart(results.data);
        },
        error: function(error) {
          console.error("Erro ao parsear o CSV:", error.message);
        }
      });
    };
  
    reader.readAsText(file);
  }
  
  function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.Cidade),
        datasets: [
          {
            label: 'Inscritos',
            data: data.map(item => item.Inscritos),
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Desistentes',
            data: data.map(item => item.Desistentes),
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  async function fetchData() {
    try {
      const response = await fetch('data.csv');
      const data = await response.text();
      const table = data.split('\n').slice(1);
      const result = table.map(row => {
        const values = row.split(',');
        return {
          ID: values[0],
          Cidade: values[1],
          Estado: values[2],
          Instituição: values[3],
          Inscritos: parseInt(values[4]),
          Desistentes: parseInt(values[5])
        };
      });
      createChart(result);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  }