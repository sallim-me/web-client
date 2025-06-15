import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

interface PostPriceCardProps {
  modelName?: string;
  brand?: string;
  currentPrice?: number;
  userPrice?: number;
}

export const PostPriceCard: React.FC<PostPriceCardProps> = ({
  modelName = "냉장고",
  brand = "브랜드",
  currentPrice = 500000,
  userPrice = 450000,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer로 가시성 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 가격 데이터 생성 (최근 12개월 시뮬레이션 + 현재 제품)
  const priceData = useMemo(() => {
    const months = [];
    const basePrice = currentPrice * 1.8; // 신제품 가격을 현재가의 1.8배로 가정
    
    // 과거 12개월 데이터 생성
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      // 감가상각 곡선 (초기 빠른 하락 후 완만한 하락)
      const ageInMonths = 11 - i;
      const depreciationRate = 1 - (0.4 * (1 - Math.exp(-ageInMonths / 6)));
      const marketPrice = Math.round(basePrice * depreciationRate);
      
      // 약간의 변동성 추가
      const variation = (Math.random() - 0.5) * 0.1;
      const finalPrice = Math.round(marketPrice * (1 + variation));
      
      months.push({
        month: date.toLocaleDateString('ko-KR', { month: 'short' }),
        price: finalPrice,
        averagePrice: marketPrice,
        isCurrentProduct: false,
      });
    }
    
    // 현재 제품 데이터 추가 (마지막 포인트)
    months.push({
      month: '이 상품',
      price: currentPrice,
      averagePrice: currentPrice,
      isCurrentProduct: true,
    });
    
    return months;
  }, [currentPrice]);

  // 적정 가격 범위 계산 (현재 제품 제외한 마지막 시장 데이터 기준)
  const latestMarketPrice = priceData[priceData.length - 2]?.averagePrice || currentPrice;
  const recommendedMinPrice = Math.round(latestMarketPrice * 0.90);
  const recommendedMaxPrice = Math.round(latestMarketPrice * 1.15);
  
  // 현재 가격이 적정 범위에 있는지 확인
  const isPriceAppropriate = currentPrice >= recommendedMinPrice && currentPrice <= recommendedMaxPrice;
  const isPriceLow = currentPrice < recommendedMinPrice;
  
  // 가격 트렌드 계산
  const firstPrice = priceData[0]?.price || currentPrice;
  const lastPrice = priceData[priceData.length - 1]?.price || currentPrice;
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isIncreasing = priceChange > 0;

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isCurrentProduct = payload[0].payload?.isCurrentProduct;
      return (
        <Paper sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            {isCurrentProduct ? '판매가' : '시장가'}: ₩{payload[0].value.toLocaleString()}
          </Typography>
          {isCurrentProduct && (
            <Typography variant="caption" color="text.secondary">
              현재 보고있는 제품
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper 
      ref={containerRef}
      elevation={0} 
      sx={{
        pt: 2,
        // p: 3, 
        // border: `1px solid ${theme.palette.divider}`,
        // borderRadius: 2,
      }}
    >
      <Stack spacing={0}>
        {/* 헤더 */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            가격 분석
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {brand} {modelName}의 최근 12개월 시장 가격 추이
          </Typography>
        </Box>

        {/* 가격 차트 */}
        <Box sx={{ width: '100%', height: 400, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={priceData} 
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              key={isVisible ? 'visible' : 'hidden'}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.grey[300]}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => `₩${(value / 10000).toFixed(0)}만`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                animationDuration={300}
              />
              
              {/* 적정 가격 범위 */}
              <ReferenceArea
                y1={recommendedMinPrice}
                y2={recommendedMaxPrice}
                fill={theme.palette.success.light}
                fillOpacity={0.1}
                stroke={theme.palette.success.main}
                strokeDasharray="5 5"
              />
              
              {/* 현재 판매가 라인 */}
              <ReferenceLine 
                y={currentPrice} 
                stroke={theme.palette.warning.main}
                strokeWidth={2}
                strokeDasharray="8 4"
              />
              
              {/* 시장 가격 추이 라인 */}
              <Line
                type="monotone"
                dataKey="price"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                animationDuration={isVisible ? 2500 : 0}
                animationBegin={isVisible ? 500 : 0}
                animationEasing="ease-in-out"
                strokeDasharray="0"
                dot={(props) => {
                  const { payload } = props;
                  if (payload?.isCurrentProduct) {
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={8}
                        fill={theme.palette.warning.main}
                        stroke="white"
                        strokeWidth={3}
                      />
                    );
                  }
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={theme.palette.primary.main}
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: theme.palette.primary.main, 
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* 가격 정보 요약 */}
        <Stack spacing={2}>
          {/* 현재 가격 상태 */}
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: (isPriceAppropriate || isPriceLow)
                ? theme.palette.success.light + '20' 
                : theme.palette.warning.light + '20',
              borderRadius: 1,
              border: `1px solid ${
                (isPriceAppropriate || isPriceLow)
                  ? theme.palette.success.light 
                  : theme.palette.warning.light
              }`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {(isPriceAppropriate || isPriceLow) ? (
                <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
              ) : (
                <WarningIcon color="warning" sx={{ fontSize: 20 }} />
              )}
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {isPriceLow ? '합리적인 가격' : isPriceAppropriate ? '적정 가격 범위' : '가격 검토 필요'}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isPriceLow
                ? '시장 가격보다 낮게 책정되었습니다. 지금 구매하세요!'
                : isPriceAppropriate 
                  ? '시장 가격 대비 적절한 가격으로 책정되었습니다.'
                  : '시장 가격보다 높게 책정되었습니다. 가격 조정을 고려해보세요.'
              }
            </Typography>
          </Box>

          {/* 가격 정보 */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                현재 판매가
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ₩{currentPrice.toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                적정 가격 범위
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ₩{recommendedMinPrice.toLocaleString()} ~ ₩{recommendedMaxPrice.toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          {/* 가격 트렌드 */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {isIncreasing ? (
              <TrendingUpIcon color="error" sx={{ fontSize: 18 }} />
            ) : (
              <TrendingDownIcon color="success" sx={{ fontSize: 18 }} />
            )}
            <Typography variant="body2" color="text.secondary">
              12개월 가격 변화:
            </Typography>
            <Chip
              label={`${priceChange > 0 ? '+' : ''}${priceChange.toFixed(1)}%`}
              size="small"
              color={isIncreasing ? 'error' : 'success'}
              variant="outlined"
            />
          </Stack>
        </Stack>

        {/* 참고 사항 */}
        <Box sx={{ mt: 1, p: 1.5, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 이 분석은 시장 데이터를 기반으로 한 참고용 정보입니다. 
            실제 거래 시 제품 상태, 지역별 차이 등을 고려하여 가격을 결정하세요.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};