import React from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts, parsePeriod } from "./actions/charts";
import SingleStatBox from "components/SingleStatBox";
import TopNavBar from "components/TopNavBar";
import { switchTheme } from "actions/theme";
import cx from "classnames";
import moment from "moment";
import SingleStat from "components/SingleStat";
import numeral from "numeral";
const HAV_CHART = {
  HavvenPrice: "HavvenPrice",
  HavvenMarketCap: "HavvenMarketCap",
  HavvenVolume24h: "HavvenVolume24h",
  LockedUpHavven: "LockedUpHavven"
};
const nUSD_CHART = {
  NominPrice: "NominPrice",
  NominMarketCap: "NominMarketCap",
  NominVolume24h: "NominVolume24h",
  NominFeesCollected: "NominFeesCollected",
  CollateralizationRatio: "CollateralizationRatio"
};
const DECIMALS = {
  HavvenMarketCap: { Val: 0, Btc: 0 },
  HavvenPrice: { Val: 3, Btc: 7 },
  HavvenVolume24h: { Val: 0, Btc: 0 },
  LockedUpHavven: { Val: 0 },
  HavvenVolume24h: { Val: 0 },
  NominMarketCap: { Val: 2 },
  NominPrice: { Val: 3 },
  NominVolume24h: { Val: 2 },
  NominFeesCollected: { Val: 2 },
  CollateralizationRatio: { Val: 2 } //%
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: "stats",
    themeCss: "",
    havButtons: { Usd: true, Btc: true, Eth: false },
    havChartName: HAV_CHART.HavvenPrice,
    nUSDChartName: nUSD_CHART.NominPrice
  };

  componentDidMount() {
    this.switchTheme();
  }

  componentWillMount() {
    this.fetchCharts();
    this.setState({
      intervalId: setInterval(this.fetchCharts, 60000)
    });
  }

  onCurrencyClick = val => {
    let havButtons = { ...this.state.havButtons };
    havButtons[val] = !havButtons[val];
    this.setState({
      havButtons
    });
  };

  setHavChart = chartName => {
    this.setState({ havChartName: chartName });
  };

  setnUSDChart = chartName => {
    this.setState({ nUSDChartName: chartName });
  };

  setPeriod = (period, curr="HAV")=> {
      this.props.parsePeriod(period, curr);
      /*1D,1W,1M,1Y,ALL*/
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      this.switchTheme();
    }
  }

  fetchCharts = () => {
    this.props.fetchCharts();
  };

  switchTheme() {
    if (this.props.theme === "dark") {
      import(`styling/dark.css`).then(res => {
        this.setState({ themeCss: res[0][1] });
      });
    } else {
      import(`styling/light.css`).then(res => {
        this.setState({ themeCss: res[0][1] });
      });
    }
  }

  render() {
    const { charts, theme } = this.props;
    const {
      activeSection,
      themeCss,
      havButtons,
      havChartName,
      nUSDChartName
    } = this.state;
    const { stats, lastUpdated } = charts;
    const {
      HavvenMarketCap,
      HavvenVolume24h,
      HavvenPrice,
      LockedUpHavven
    } = HAV_CHART;
    const {
      NominMarketCap,
      NominVolume24h,
      NominPrice,
      CollateralizationRatio,
      NominFeesCollected
    } = nUSD_CHART;

    const minsAgo = moment(Date.now()).diff(lastUpdated, "minutes");

    const havStats = {
      [HAV_CHART.HavvenMarketCap]: {
        value: stats.havvenMarketCap,
        trend: stats.havvenMarketCap24hDelta
      },
      [HAV_CHART.HavvenPrice]: {
        value: stats.havvenPriceCap,
        trend: stats.havvenPriceCap24hDelta
      },
      [HAV_CHART.HavvenVolume24h]: {
        value: stats.havvenVolume24h,
        trend: stats.havvenMarketCap24hDelta
      }
    };
    const currentHavStat = havStats[havChartName];

    const nominStats = {
      [nUSD_CHART.NominMarketCap]: {
        value: stats.nominMarketCap,
        trend: stats.nominMarketCap24hDelta
      },
      [nUSD_CHART.NominPrice]: {
        value: stats.nominPriceCap,
        trend: stats.nominPriceCap24hDelta
      },
      [nUSD_CHART.NominVolume24h]: {
        value: stats.nominVolume24h,
        trend: stats.nominMarketCap24hDelta
      }
    };
    const currentNominStat = nominStats[nUSDChartName];

    return (
      <div className="dashboard-root">
        <style>{themeCss}</style>
        <div className="is-hidden-mobile last-updated-top">
          <label>LAST UPDATED</label> <span>{minsAgo} MINS AGO</span>{" "}
        </div>
        <TopNavBar selectedSection={activeSection} />
        <div className="container main-content">
          <div className="columns is-multiline" id="stats">
            <SingleStatBox
              value={stats.havvenMarketCap}
              trend={stats.havvenMarketCap24hDelta * 100}
              label="HAVVEN MARKET CAP"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStatBox
              value={stats.havvenPriceCap}
              trend={stats.havvenPriceCap24hDelta * 100}
              label="HAVVEN PRICE"
              desc="Price of Havven multipled by it’s curiculating supply."
              decimals={3}
            />
            <SingleStatBox
              value={stats.nominMarketCap}
              trend={stats.nominMarketCap24hDelta * 100}
              label="nUSD MARKET CAP"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStatBox
              value={stats.nominPriceCap}
              trend={stats.nominPriceCap24hDelta * 100}
              label="nUSD PRICE"
              desc="Price of Havven multipled by it’s curiculating supply."
              decimals={3}
            />
          </div>
        </div>
        <div className="container chart-section" id="hav">
          <div>
            <div className="level is-mobile chart-section__heading">
              <div className="level-left is-hidden-mobile">
                <div className="level-item title">
                  <h2>HAV</h2>
                  <span>(HAVVEN)</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button
                    className={cx("button", "is-link", {
                      "is-active": havChartName === HavvenMarketCap
                    })}
                    onClick={() => {
                      this.setHavChart(HavvenMarketCap);
                    }}
                  >
                    Market Cap
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button", "is-link", {
                      "is-active": havChartName === HavvenPrice
                    })}
                    onClick={() => {
                      this.setHavChart(HavvenPrice);
                    }}
                  >
                    Price
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button", "is-link", {
                      "is-active": havChartName === HavvenVolume24h
                    })}
                    onClick={() => {
                      this.setHavChart(HavvenVolume24h);
                    }}
                  >
                    Volume
                  </button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box chart-box--main">
                  <SingleStat
                    value={currentHavStat.value}
                    trend={currentHavStat.trend}
                  />
                  <div className="time-toggles is-hidden-mobile">
                    <button onClick={()=>this.setPeriod("1D")}>1D</button>
                    <button onClick={()=>this.setPeriod("1W")}>1W</button>
                    <button onClick={()=>this.setPeriod("1M")}>1M</button>
                    <button onClick={()=>this.setPeriod("1Y")}>1Y</button>
                    <button onClick={()=>this.setPeriod("ALL")} className="is-active">ALL</button>
                  </div>
                  <div>
                    <Chart
                      info={charts[havChartName]}
                      decimals={DECIMALS[havChartName]}
                      fullSize={true}
                      colorGradient="green"
                      lastUpdated={lastUpdated}
                      currencySwitch={this.state.havButtons}
                      tooltipDecimal={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="time-toggles is-hidden-tablet">
              <button onClick={()=>this.setPeriod("1D")}>1D</button>
              <button onClick={()=>this.setPeriod("1W")}>1W</button>
              <button onClick={()=>this.setPeriod("1M")}>1M</button>
              <button onClick={()=>this.setPeriod("1Y")}>1Y</button>
              <button onClick={()=>this.setPeriod("ALL")} className="is-active">ALL</button>
            </div>
            <div className="level is-mobile justified-content-center">
              <div className="level-left" />
              <div className="level-right currency-toggles">
                <div className="level-item">
                  <button
                    className={cx("button is-link usd", {
                      "is-active": havButtons.Usd
                    })}
                    onClick={() => this.onCurrencyClick("Usd")}
                  >
                    USD
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button is-link btc", {
                      "is-active": havButtons.Btc
                    })}
                    onClick={() => this.onCurrencyClick("Btc")}
                  >
                    BTC
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button is-link eth", {
                      "is-active": havButtons.Eth
                    })}
                    onClick={() => this.onCurrencyClick("Eth")}
                  >
                    ETH
                  </button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>LOCKED HAV VALUE</h3>
                    <div>The total value of all locked Havven.</div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.lockedUpHavven).format(`$0,0.`)}
                  </div>
                  <Chart
                    info={charts.LockedUpHavven}
                    decimals={DECIMALS[LockedUpHavven]}
                    colorGradient="yellow"
                    lastUpdated={lastUpdated}
                  />
                </div>
              </div>
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>LOCKED HAV RATIO</h3>
                    <div>
                      The ratio of nUSD market cap to locked HAV market cap.
                    </div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.lockedUpHavvenRatio * 100).format("0.00")}%
                  </div>
                  <Chart
                    info={charts.HavvenVolume24h}
                    decimals={DECIMALS[HavvenVolume24h]}
                    colorGradient="red"
                    lastUpdated={lastUpdated}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container chart-section" id="nusd">
          <div>
            <div className="level is-mobile chart-section__heading">
              <div className="level-left is-hidden-mobile">
                <div className="level-item title">
                  <h2>nUSD</h2>
                  <span>(NOMINS)</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button
                    className={cx("button", "is-link", {
                      "is-active": nUSDChartName === NominMarketCap
                    })}
                    onClick={() => {
                      this.setnUSDChart(NominMarketCap);
                    }}
                  >
                    Market Cap
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button", "is-link", {
                      "is-active": nUSDChartName === NominPrice
                    })}
                    onClick={() => {
                      this.setnUSDChart(NominPrice);
                    }}
                  >
                    Price
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button", "is-link", {
                      "is-active": nUSDChartName === NominVolume24h
                    })}
                    onClick={() => {
                      this.setnUSDChart(NominVolume24h);
                    }}
                  >
                    Volume
                  </button>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <div className="chart-box chart-box--main">
                  <SingleStat
                    value={currentNominStat.value}
                    trend={currentNominStat.trend}
                  />
                  <div className="time-toggles is-hidden-mobile">
                    <button>1D</button>
                    <button>1W</button>
                    <button>1M</button>
                    <button>1Y</button>
                    <button className="is-active">ALL</button>
                  </div>
                  <div>
                    <Chart
                      info={charts[nUSDChartName]}
                      decimals={DECIMALS[nUSDChartName]}
                      fullSize={true}
                      colorGradient="green"
                      lastUpdated={lastUpdated}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="time-toggles is-hidden-tablet">
              <button>1D</button>
              <button>1W</button>
              <button>1M</button>
              <button>1Y</button>
              <button className="is-active">ALL</button>
            </div>
            <div className="level is-mobile justified-content-center">
              <div className="level-left" />
              <div className="level-right currency-toggles">
                <div className="level-item">
                  <button
                    className={cx("button is-link usd", {
                      "is-active": havButtons.Usd
                    })}
                    onClick={() => this.onCurrencyClick("Usd")}
                  >
                    USD
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button is-link btc", {
                      "is-active": havButtons.Btc
                    })}
                    onClick={() => this.onCurrencyClick("Btc")}
                  >
                    BTC
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx("button is-link eth", {
                      "is-active": havButtons.Eth
                    })}
                    onClick={() => this.onCurrencyClick("Eth")}
                  >
                    ETH
                  </button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>TOTAL FEES</h3>
                    <div>
                      The cumulative USD value of fees collected over time.
                    </div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.nominFeesCollected).format(`$0,0.`)}
                  </div>
                  <Chart
                    info={charts.NominFeesCollected}
                    decimals={DECIMALS[NominFeesCollected]}
                    colorGradient="green"
                    lastUpdated={lastUpdated}
                  />
                </div>
              </div>
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>COLLATERALIZATION RATIO</h3>
                    <div>
                      The ratio of nUSD market cap to locked HAV market cap.
                    </div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.collateralizationRatio * 100).format("0.00")}%
                  </div>
                  <Chart
                    info={charts.CollateralizationRatio}
                    decimals={DECIMALS[CollateralizationRatio]}
                    colorGradient="red"
                    lastUpdated={lastUpdated}
                    sign="%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container main-content">
          <div className="columns">
            <div className="column">
              <div className="footer-info">
                <div className="last-updated-bottom">
                  <label>LAST UPDATED</label> <span>{minsAgo} MINS AGO</span>
                </div>
                <div
                  className={cx("theme-switcher", theme)}
                  onClick={() =>
                    this.props.switchTheme(theme === "dark" ? "light" : "dark")
                  }
                >
                  <label>{theme}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { charts, theme } = state;

  return {
    charts,
    theme: theme.theme
  };
};

const ConnectedApp = connect(mapStateToProps, { switchTheme, fetchCharts, parsePeriod })(
  App
);
export default ConnectedApp;
