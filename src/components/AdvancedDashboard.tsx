'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Dados simulados para gráficos
const monthlyData = [
  { month: 'Jan', cases: 245, resolved: 189, value: 1200000 },
  { month: 'Fev', cases: 298, resolved: 234, value: 1450000 },
  { month: 'Mar', cases: 356, resolved: 287, value: 1680000 },
  { month: 'Abr', cases: 423, resolved: 345, value: 1950000 },
  { month: 'Mai', cases: 389, resolved: 312, value: 1820000 },
  { month: 'Jun', cases: 467, resolved: 398, value: 2100000 },
  { month: 'Jul', cases: 512, resolved: 445, value: 2350000 },
  { month: 'Ago', cases: 478, resolved: 402, value: 2180000 },
];

const agencyData = [
  { name: 'ANVISA', cases: 1247, color: '#3B82F6' },
  { name: 'PROCON', cases: 856, color: '#10B981' },
  { name: 'ANS', cases: 634, color: '#F59E0B' },
  { name: 'MS', cases: 423, color: '#EF4444' },
  { name: 'CADE', cases: 289, color: '#8B5CF6' },
  { name: 'MPE', cases: 178, color: '#06B6D4' },
];

const medicationData = [
  { category: 'Oncológicos', cases: 489, avgValue: 4500, urgency: 'Alta' },
  { category: 'Diabetes', cases: 367, avgValue: 180, urgency: 'Média' },
  { category: 'Hipertensão', cases: 298, avgValue: 45, urgency: 'Baixa' },
  { category: 'Doenças Raras', cases: 156, avgValue: 8900, urgency: 'Alta' },
  { category: 'Antibióticos', cases: 234, avgValue: 85, urgency: 'Média' },
  { category: 'Analgésicos', cases: 145, avgValue: 25, urgency: 'Baixa' },
];

const regionData = [
  { region: 'Sudeste', cases: 1456, resolved: 1189, percentage: 81.7 },
  { region: 'Nordeste', cases: 823, resolved: 645, percentage: 78.4 },
  { region: 'Sul', cases: 567, resolved: 478, percentage: 84.3 },
  { region: 'Centro-Oeste', cases: 345, resolved: 267, percentage: 77.4 },
  { region: 'Norte', cases: 234, resolved: 178, percentage: 76.1 },
];

const satisfactionData = [
  { name: 'Muito Satisfeito', value: 42, color: '#10B981' },
  { name: 'Satisfeito', value: 35, color: '#3B82F6' },
  { name: 'Neutro', value: 15, color: '#F59E0B' },
  { name: 'Insatisfeito', value: 6, color: '#EF4444' },
  { name: 'Muito Insatisfeito', value: 2, color: '#991B1B' },
];

const legalBasisData = [
  { law: 'Lei 9.656/98', cases: 567, success: 89 },
  { law: 'CDC', cases: 456, success: 92 },
  { law: 'Lei 8.080/90', cases: 389, success: 85 },
  { law: 'Lei 9.782/99', cases: 298, success: 78 },
  { law: 'Lei 12.529/11', cases: 189, success: 73 },
];

interface AdvancedDashboardProps {
  className?: string;
}

export default function AdvancedDashboard({ className = '' }: AdvancedDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('cases');

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Controles do Dashboard */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Analítico</h2>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="1m">Último mês</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Último ano</option>
            </select>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="cases">Número de Casos</option>
              <option value="value">Valor Recuperado</option>
              <option value="time">Tempo de Resolução</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolução Mensal */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Evolução Mensal de Casos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cases" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.6}
                name="Total de Casos"
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.8}
                name="Casos Resolvidos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Órgão */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Casos por Órgão Competente</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cases"
              >
                {agencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {agencyData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.cases}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categorias de Medicamentos */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Categorias de Medicamentos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={medicationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="category" type="category" stroke="#6B7280" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px'
                }}
                formatter={(value: any, name: string) => [
                  name === 'cases' ? `${value} casos` : `R$ ${value}`,
                  name === 'cases' ? 'Casos' : 'Valor Médio'
                ]}
              />
              <Bar dataKey="cases" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfação do Usuário */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Satisfação do Usuário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={satisfactionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {satisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`${value}%`, 'Percentual']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {satisfactionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance por Região */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance por Região</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="region" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="cases" fill="#8B5CF6" name="Total de Casos" />
              <Bar dataKey="resolved" fill="#10B981" name="Casos Resolvidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Base Legal - Taxa de Sucesso */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Taxa de Sucesso por Base Legal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={legalBasisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="law" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px'
                }}
                formatter={(value: any, name: string) => [
                  name === 'success' ? `${value}%` : `${value} casos`,
                  name === 'success' ? 'Taxa de Sucesso' : 'Total de Casos'
                ]}
              />
              <Bar dataKey="success" fill="#F59E0B" name="Taxa de Sucesso (%)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {legalBasisData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.law}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900">{item.cases} casos</span>
                  <span className={`font-medium ${item.success >= 85 ? 'text-green-600' : item.success >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {item.success}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Métricas Detalhadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">94.2%</div>
            <div className="text-sm text-gray-600">Taxa de Resolução</div>
            <div className="text-xs text-green-600 mt-1">↑ +2.3% vs mês anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">23 dias</div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
            <div className="text-xs text-green-600 mt-1">↓ -3 dias vs mês anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">R$ 2.847</div>
            <div className="text-sm text-gray-600">Valor Médio por Caso</div>
            <div className="text-xs text-red-600 mt-1">↑ +R$ 156 vs mês anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8/5</div>
            <div className="text-sm text-gray-600">Satisfação Média</div>
            <div className="text-xs text-green-600 mt-1">↑ +0.2 vs mês anterior</div>
          </div>
        </div>
      </div>
    </div>
  );
}
