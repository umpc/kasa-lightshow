# kasa-lightshow
Script for configuring color transitions on a TP-Link LB130

## Usage

From the root of the project directory:

1. Run `npm install`
2. Move or copy `example.config.json` to `config.json`
3. Change `ip` in `config.json` to the IP address of your LB130
4. Run `npm start`

## Configuration Notes

Duration values are in seconds.

## Example Configuration

```json
{
  "ip": "10.0.0.8",
  "hue": [[0, 248], [315, 360]],
  "saturation": [[25, 50], [100, 100]],
  "brightness": [[50, 75], [100, 100]],
  "minHueDifference": 22.5,
  "nextState": {
    "transitionPeriod": 10,
    "interval": 11
  }
}
```
