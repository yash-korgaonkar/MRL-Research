import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { severityColor } from '../../theme/colors';

interface SeverityDialProps {
    score: number; // 0–10
    size?: number;
}

export default function SeverityDial({ score, size = 200 }: SeverityDialProps) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.38;
    const strokeWidth = size * 0.08;

    // Arc from 135° to 405° (270° sweep)
    const startAngle = 135;
    const endAngle = 405;
    const sweepAngle = endAngle - startAngle;
    const valueAngle = startAngle + (score / 10) * sweepAngle;

    const polarToCartesian = (angle: number) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad),
        };
    };

    const arcPath = (start: number, end: number) => {
        const s = polarToCartesian(start);
        const e = polarToCartesian(end);
        const largeArc = end - start > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    };

    const bgPath = arcPath(startAngle, endAngle);
    const fgPath = score > 0 ? arcPath(startAngle, valueAngle) : '';
    const color = severityColor(score);
    const needlePoint = polarToCartesian(valueAngle);

    return (
        <View className="items-center">
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background arc */}
                <Path
                    d={bgPath}
                    stroke="#21262D"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Value arc */}
                {score > 0 && (
                    <Path
                        d={fgPath}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                    />
                )}

                {/* Needle dot */}
                <Circle cx={needlePoint.x} cy={needlePoint.y} r={size * 0.03} fill={color} />

                {/* Center score */}
                <SvgText
                    x={cx}
                    y={cy - size * 0.02}
                    textAnchor="middle"
                    fontSize={size * 0.22}
                    fontWeight="bold"
                    fill={color}
                >
                    {score}
                </SvgText>

                <SvgText
                    x={cx}
                    y={cy + size * 0.1}
                    textAnchor="middle"
                    fontSize={size * 0.07}
                    fill="#8B949E"
                >
                    / 10
                </SvgText>

                {/* Scale labels */}
                <SvgText
                    x={polarToCartesian(startAngle).x - 5}
                    y={polarToCartesian(startAngle).y + 15}
                    textAnchor="middle"
                    fontSize={size * 0.06}
                    fill="#484F58"
                >
                    0
                </SvgText>
                <SvgText
                    x={polarToCartesian(endAngle).x + 5}
                    y={polarToCartesian(endAngle).y + 15}
                    textAnchor="middle"
                    fontSize={size * 0.06}
                    fill="#484F58"
                >
                    10
                </SvgText>
            </Svg>
        </View>
    );
}
