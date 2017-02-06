push:
	git add -A
	git commit -m "update at `date`"
	git push

theme:
	cd ./themes/plain && gulp && git add -A && git commit

g:
	hexo clean && hexo g

deploy: g
	firebase deploy --only hosting

s: g
	firebase serve