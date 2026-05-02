import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, DollarSign, Percent, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlatformSettings {
  minWithdrawAmount: number;
  withdrawFeePercent: number;
  aiJudgeCost: number;
  creatorRewardPercent: number;
  platformFeePercent: number;
  reservePercent: number;
}

export function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PlatformSettings>({
    minWithdrawAmount: 100,
    withdrawFeePercent: 5,
    aiJudgeCost: 20,
    creatorRewardPercent: 5,
    platformFeePercent: 5,
    reservePercent: 20,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    alert('设置已保存');
  };

  return (
    <div>
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              提现设置
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低提现金额（元）
              </label>
              <input
                type="number"
                value={settings.minWithdrawAmount}
                onChange={(e) => setSettings({ ...settings, minWithdrawAmount: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提现手续费（%）
              </label>
              <input
                type="number"
                value={settings.withdrawFeePercent}
                onChange={(e) => setSettings({ ...settings, withdrawFeePercent: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mt-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              AI 评判设置
            </h2>
          </div>
          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI 评判调用费用（咖豆）
              </label>
              <input
                type="number"
                value={settings.aiJudgeCost}
                onChange={(e) => setSettings({ ...settings, aiJudgeCost: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mt-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="w-5 h-5 text-green-500" />
              收益分配比例
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                创作者奖励（%）
              </label>
              <input
                type="number"
                value={settings.creatorRewardPercent}
                onChange={(e) => setSettings({ ...settings, creatorRewardPercent: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                平台服务费（%）
              </label>
              <input
                type="number"
                value={settings.platformFeePercent}
                onChange={(e) => setSettings({ ...settings, platformFeePercent: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                储备金（%）
              </label>
              <input
                type="number"
                value={settings.reservePercent}
                onChange={(e) => setSettings({ ...settings, reservePercent: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存设置'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
