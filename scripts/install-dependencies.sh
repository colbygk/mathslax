cd node_modules/MathJax-node

git clone https://github.com/mathjax/MathJax mathjax
cd mathjax
git checkout develop
cd ..

cd batik
curl http://apache.org/dist/xmlgraphics/batik/binaries/batik-1.7-jre13.zip > batik-1.7-jre13.zip
jar xvf batik-1.7-jre13.zip
mv batik-1.7/* .
cd -

cd -
