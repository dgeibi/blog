push:
	hexo clean && hexo g
	git add -A
	git commit -m "update at `date`"
	git push

theme:
	cd ./themes/plain && gulp && git add -A && git commit
