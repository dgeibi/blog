push:
	git add -A
	git commit -m "update at `date`"
	git push

theme:
	cd ./themes/plain && gulp && git add -A && git commit && git push

g:
	hexo clean && hexo g

deploy: g
	firebase deploy --only hosting

s: g
	hexo s
