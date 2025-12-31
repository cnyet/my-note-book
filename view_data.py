#!/usr/bin/env python3
"""
AI生活助理数据查看工具
"""

import os
import glob
from datetime import datetime, timedelta
from pathlib import Path

def list_available_dates():
    """列出所有可用的日期"""
    data_dir = Path("data/daily_logs")
    if not data_dir.exists():
        print("❌ 数据目录不存在")
        return []
    
    dates = []
    for date_dir in data_dir.iterdir():
        if date_dir.is_dir() and date_dir.name.count('-') == 2:
            dates.append(date_dir.name)
    
    return sorted(dates, reverse=True)

def show_date_summary(date):
    """显示指定日期的数据摘要"""
    date_dir = Path(f"data/daily_logs/{date}")
    if not date_dir.exists():
        print(f"❌ 日期 {date} 的数据不存在")
        return
    
    print(f"\n📅 {date} 数据摘要")
    print("=" * 50)
    
    files = list(date_dir.glob("*.md"))
    if not files:
        print("📝 该日期没有数据文件")
        return
    
    for file in sorted(files):
        file_size = file.stat().st_size
        mod_time = datetime.fromtimestamp(file.stat().st_mtime)
        
        # 读取文件前几行作为预览
        try:
            with open(file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                preview = ''.join(lines[:3]).strip()
                if len(preview) > 100:
                    preview = preview[:100] + "..."
        except:
            preview = "无法读取预览"
        
        print(f"\n📄 {file.name}")
        print(f"   大小: {file_size} 字节")
        print(f"   修改时间: {mod_time.strftime('%H:%M:%S')}")
        print(f"   预览: {preview}")

def show_file_content(date, filename):
    """显示指定文件的完整内容"""
    file_path = Path(f"data/daily_logs/{date}/{filename}")
    if not file_path.exists():
        print(f"❌ 文件不存在: {file_path}")
        return
    
    print(f"\n📖 {filename} - {date}")
    print("=" * 60)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            print(content)
    except Exception as e:
        print(f"❌ 读取文件失败: {e}")

def show_recent_activity():
    """显示最近的活动"""
    print("\n🕒 最近活动")
    print("=" * 30)
    
    # 查找最近修改的文件
    all_files = []
    for file_path in Path("data/daily_logs").rglob("*.md"):
        mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
        all_files.append((mod_time, file_path))
    
    # 按修改时间排序，显示最近10个
    all_files.sort(reverse=True)
    for i, (mod_time, file_path) in enumerate(all_files[:10]):
        relative_path = file_path.relative_to("data/daily_logs")
        print(f"{i+1:2d}. {mod_time.strftime('%m-%d %H:%M')} - {relative_path}")

def main():
    """主函数"""
    print("🤖 AI生活助理数据查看器")
    print("=" * 40)
    
    while True:
        print("\n📋 选择操作:")
        print("1. 查看可用日期")
        print("2. 查看指定日期摘要")
        print("3. 查看指定文件内容")
        print("4. 查看最近活动")
        print("5. 退出")
        
        choice = input("\n请选择 (1-5): ").strip()
        
        if choice == '1':
            dates = list_available_dates()
            if dates:
                print(f"\n📅 可用日期 (共{len(dates)}个):")
                for i, date in enumerate(dates[:10]):  # 显示最近10个
                    print(f"  {i+1}. {date}")
                if len(dates) > 10:
                    print(f"  ... 还有 {len(dates)-10} 个更早的日期")
            else:
                print("📝 暂无数据")
        
        elif choice == '2':
            dates = list_available_dates()
            if not dates:
                print("📝 暂无数据")
                continue
            
            print(f"\n可用日期: {', '.join(dates[:5])}")
            date = input("请输入日期 (YYYY-MM-DD): ").strip()
            show_date_summary(date)
        
        elif choice == '3':
            dates = list_available_dates()
            if not dates:
                print("📝 暂无数据")
                continue
            
            print(f"\n可用日期: {', '.join(dates[:5])}")
            date = input("请输入日期 (YYYY-MM-DD): ").strip()
            
            date_dir = Path(f"data/daily_logs/{date}")
            if not date_dir.exists():
                print(f"❌ 日期 {date} 不存在")
                continue
            
            files = list(date_dir.glob("*.md"))
            if not files:
                print("📝 该日期没有文件")
                continue
            
            print(f"\n可用文件:")
            for i, file in enumerate(files):
                print(f"  {i+1}. {file.name}")
            
            filename = input("请输入文件名: ").strip()
            show_file_content(date, filename)
        
        elif choice == '4':
            show_recent_activity()
        
        elif choice == '5':
            print("👋 再见!")
            break
        
        else:
            print("❌ 无效选择，请重试")

if __name__ == "__main__":
    main()