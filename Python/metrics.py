def sharpe_ratio(returns: pd.Series) -> float:
    """Calculate Sharpe ratio for strategy returns."""
    excess_returns = returns - risk_free_rate
    return excess_returns.mean() / excess_returns.std()
