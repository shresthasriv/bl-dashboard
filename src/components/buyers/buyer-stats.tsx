import { getSession } from '@/lib/auth';
import { BuyerService } from '@/services/buyer.service';

export async function BuyerStats() {
  const user = await getSession();
  if (!user) return null;

  const buyerService = new BuyerService();
  const stats = await buyerService.getBuyerStats(user.id);

  const statCards = [
    {
      label: 'Total Leads',
      value: stats.total,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'New',
      value: stats.byStatus.New || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Qualified',
      value: stats.byStatus.Qualified || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Closed Won',
      value: stats.byStatus.Closed_Won || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
          <div className="text-sm font-medium text-gray-600">{stat.label}</div>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
