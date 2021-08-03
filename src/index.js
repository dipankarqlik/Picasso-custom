/* eslint-disable */
import embed from './configure';
import connect from './connect';
import picassojs from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

async function run() {
  const app = await connect({
    url: '<URL>',
    webIntegrationId: '<ID>',
    appId: '<APP_ID>',
  });

  const n = embed(app);

  (await n.selections()).mount(document.querySelector('.toolbar'));

 
  const picasso = picassojs();


   picasso.use(picassoQ);

   //Property for Scatter plot:
  const properties = {
    qInfo: {
      qType: "my-stacked-hypercube"
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: { qFieldDefs: ["Sport"] },
        }
      ],
      qMeasures: [
        { qDef: { qDef: "Avg(Height)" } 
        },
        { qDef: { qDef: "Avg(Weight)" }
        }
      ],
      qInitialDataFetch: [{ qTop: 0, qLeft: 0, qWidth: 100, qHeight: 100 }]
    }
  };


  const variableListModel = await app
    .createSessionObject(properties)
    .then(model => model);

  variableListModel.getLayout().then(layout => {
    createChart(layout);
  });

  variableListModel.on('changed',async()=>{
    variableListModel.getLayout().then(newlayout => {
    updateChart(newlayout);
  });
  });


  
  let chart;
  function createChart(layout){
  chart = picasso.chart({
  element: document.querySelector('.object_new'),
  data: [{
    type: 'q',
    key: 'qHyperCube',
    data: layout.qHyperCube,
  }],
  settings: {
    scales: {
      s: {
        data: { field: 'qMeasureInfo/0' },
        expand: 0.2,
        invert: true,
      },
      m: {
        data: { field: 'qMeasureInfo/1' },
        expand: 0.2,
      },
      col: {
        data: { extract: { field: 'qDimensionInfo/0' } },
        type: 'color',
      },
    },
    interactions: [
              {
                type: "native",
                events: {
                  mousemove(e) {
                    //console.log(e)
                    const tooltip = this.chart.component("t");
                    tooltip.emit("show", e);
                  },
                  mouseleave(e) {
                    const tooltip = this.chart.component("t");
                    tooltip.emit("hide");
                  }
                }
              }
            ],
    components: [{
      key: 'y-axis',
      type: 'axis',
      scale: 's',
      dock: 'left',
    }, {
      key: 'x-axis',
      type: 'axis',
      scale: 'm',
      dock: 'bottom',
    }, 
    {
      key: "t",
      type: "tooltip",
        },
      {
      type: 'legend-cat',
      key: 'legend',
      dock: 'right',
      scale: 'col',
      brush: {
        trigger: [{
          on: 'tap',
          contexts: ['select'],
        }],
        consume: [{
          context: 'select',
          style: {
            active: {
              opacity: 1,
            },
            inactive: {
              opacity: 0.5,
            },
          },
        }],
      },
    }, {
      key: 'point',
      type: 'point',
      data: {
        extract: {
          field: 'qDimensionInfo/0',
          props: {
            y: { field: 'qMeasureInfo/0' },
            x: { field: 'qMeasureInfo/1' },
          },
        },
      },
      settings: {
        x: { scale: 'm' },
        y: { scale: 's' },
        shape: 'rect',
        size: 0.2,
        strokeWidth: 2,
        stroke: '#fff',
        opacity: 0.8,
        fill: { scale: 'col' },
      },
      brush: {
        trigger: [{
          on: 'tap',
          contexts: ['selection','tooltip'],
        }],
        consume: [{
          context: 'selection',
          style: {
            active: {
              opacity: 1,
            },
            inactive: {
              opacity: 0.5,
            },
          },
        }],
      },
    }],
  }
    });



    n.render({
    element: document.querySelector(".object"),
    id: "GMjDu"
  })
  }

  function updateChart(newlayout){
          chart.update({
       data: [{
    type: 'q',
    key: 'qHyperCube',
    data: newlayout.qHyperCube,
  }],
    });
        }

}

run();
