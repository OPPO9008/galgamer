
$.get("/cdn-cgi/trace",
        function(data) {
                var sip = data.match(/(ip=?)(\S*)/)[2];
                var str = data.match(/(colo=?)(\S*)/)[2];
                var every = [
                                        ['AMS', 'CloudFlare荷兰阿姆斯特丹'],
                                        ['HKG', 'CloudFlare香港'],
                                        ['MFM', 'CloudFlare澳门'],
                                        ['BKK', 'CloudFlare曼谷'],
                                        ['TPE', 'CloudFlare台北'],
                                        ['NRT', 'CloudFlare东京'],
                                        ['KIX', 'CloudFlare大阪'],
                                        ['ICN', 'CloudFlare仁川'],
                                        ['LHR', 'CloudFlare伦敦'],
                                        ['SIN', 'CloudFlare新加坡'],
                                        ['CDG', 'CloudFlare巴黎'],
                                        ['FRA', 'CloudFlare法兰克福'],
                                        ['KUL', 'CloudFlare马来西亚'],
                                        ['LAX', 'CloudFlare洛杉矶'],
                                        ['SJC', 'CloudFlare圣何塞'],
                                        ['KBP', 'CloudFlare乌克兰'],
                                        ['PRG', 'CloudFlare布拉格'],
                                        ['DME', 'CloudFlare莫斯科'],
                                        ['TSN', '百度云天津滨海'],
                                        ['WUH', '百度云武汉天河'],
                                        ['NGB', '百度云宁波栎社'],
                                        ['SZV', '百度云苏州光福'],
                                        ['XIY', '百度云西安咸阳'],
                                ];
                                var know=false;
                for (var i = 0; i < every.length; i++) {
                        if (str == every[i][0]) {
                                                                var know=true;
                                $("#mycdn").append("当前CDN节点:[" + every[i][1] + "]" + ",您的IP:" + sip );
                        }
                }
                                if(know==false){$("#mycdn").append("当前CDN节点:[" + str + "]" + ",您的IP:" + sip );
                        }
				
                });

