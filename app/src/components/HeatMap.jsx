import { useEffect, useRef, memo } from 'react'

function HeatMap() {
    const container = useRef()

    useEffect(
        () => {
            const script = document.createElement("script")
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
            script.type = "text/javascript"
            script.async = true
            script.innerHTML = `
                {
                    "exchanges": [],
                    "dataSource": "AllBR",
                    "grouping": "sector",
                    "blockSize": "market_cap_basic",
                    "blockColor": "change",
                    "locale": "br",
                    "symbolUrl": "",
                    "colorTheme": "dark",
                    "hasTopBar": false,
                    "isDataSetEnabled": false,
                    "isZoomEnabled": true,
                    "hasSymbolTooltip": true,
                    "isMonoSize": false,
                    "width": 500,
                    "height": 500
                }`
            container.current.appendChild(script)
        },
        []
    )

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright"><a href="https://br.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Monitore todos os mercados no TradingView</span></a></div>
        </div>
    )
}

export default memo(HeatMap)